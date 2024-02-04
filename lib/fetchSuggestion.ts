import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestions = async (board: Board) => {
  const todos = formatTodosForAI(board);

  const res = await fetch("api/generateSummary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ todos }),
  });
  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${res.statusText}`);
  }
  
  const GPTdata = await res.json();
  const { content } = GPTdata;
  
  return content;

  // const GPTdata = await res.json();
  // const { content } = GPTdata;

  // return content;
};

export default fetchSuggestions;
