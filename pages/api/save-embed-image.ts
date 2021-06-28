import { NextApiRequest, NextApiResponse } from "next";
import stream from "stream";
import { storage } from "../../firebase";

export type SaveEmbedImageReturnType = {
  imageURL: string;
};

const imageWriteStream = (
  fileName: string,
  dataString: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    const imageFile = storage.file(fileName);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(dataString, "base64"));

    bufferStream
      .pipe(
        imageFile.createWriteStream({
          metadata: {
            contentType: "image/png",
          },
        })
      )
      .on("error", (error) => reject(error))
      .on("finish", () => resolve(imageFile.publicUrl()));
  });

export default async function saveEmbedImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const imageString = req.query.imageString as string;
    const fileName = req.query.fileName as string;

    if (!imageString) return res.status(404).end();

    const imageURL = await imageWriteStream(fileName, imageString);

    const response: SaveEmbedImageReturnType = {
      imageURL,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
