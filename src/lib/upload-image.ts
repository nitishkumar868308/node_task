/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloudinary } from "./cloudinary";

export const UploadImage = async (
  file: File,
  folder: string,
  originalFileName?: string
) => {
  try {
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    const fileName = originalFileName ? originalFileName : "";

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: folder,
          public_id: fileName,
          overwrite: true,
        },
        (err: any, result: any) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(bytes);
    });
  } catch (error: any) {
    throw new Error(`Error uploading image: ${error.message}`);
  }
};
