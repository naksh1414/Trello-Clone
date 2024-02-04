import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;

  const uploadedFile = await storage.createFile(
    process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID!,
    ID.unique(),
    file
  );

  return uploadedFile;
};

export default uploadImage;
