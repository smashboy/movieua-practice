import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import stream from "stream";
import { storage } from "../../firebase";

export type SaveEmbedImageReturnType = {
  imageURL: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
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

const getImage = (req: NextApiRequest): Promise<string | null> =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });

    form.parse(req, (error, _, files) => {
      if (error) {
        console.log("FORM ERROR", error);
        return reject(error);
      }
      console.log("YAS", files);
      resolve(files?.file.toString() || null);
    });
  });

export default async function saveEmbedImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fileName = req.query.fileName as string;

    if (!fileName) return res.status(404).end();

    const imageString = await getImage(req);

    console.log("IMAGE STRING", imageString);

    if (!imageString)
      return res.status(200).json({
        imageURL: "",
      });

    const imageURL = await imageWriteStream(fileName, imageString);

    const response: SaveEmbedImageReturnType = {
      imageURL: "",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
