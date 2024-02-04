import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  const { todos } = await request.json();

  // Communicate with OpenAI GPT
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 100,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "When responding, welcome to the user and say welcome to the Trello-Clone-App! Limit the response to 200 characters.",
      },
      {
        role: "user",
        content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as todo, in progress, and done, then tell the user to have a productive day! Here's the data ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  // Log the OpenAI response for debugging
  console.log("OpenAI Response:", response);

  // Check if there are any errors in the OpenAI response
  if (
    response &&
    response.choices &&
    response.choices[0] &&
    response.choices[0].message
  ) {
    const data = response.choices[0].message;

    // Log the generated message for debugging
    console.log("Generated Message:", data);

    // Return the message in the JSON response
    return NextResponse.json({ message: data });
  } else {
    // Handle the case where the OpenAI response is unexpected
    return NextResponse.json({ error: "Unexpected response from OpenAI" });
  }
}
