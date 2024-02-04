import { storage } from "@/appwrite";

const getUrl = async (image: Image) => {
  const url = storage.getFilePreview(image.buckedIt, image.fieldId);

  return url;
};

export default getUrl;
