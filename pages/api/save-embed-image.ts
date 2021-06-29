import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import stream from "stream";
import { storage } from "../../firebase";
// import multer from "multer";
// import nextConnect from "next-connect";

export type SaveEmbedImageReturnType = {
  imageURL: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

// export const multerUpload = multer({
//   storage: multer.memoryStorage(),
// });

// export interface UploadReq extends NextApiRequest {
//   file: Express.Multer.File;
// }

const imageWriteStream = (
  fileName: string,
  folder: string,
  dataString: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    const imageFile = storage.file(`embeds/${folder}/${fileName}`);

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
      .on("finish", async () => {
        try {
          const isImagePublic = await imageFile.isPublic();
          if (!isImagePublic[0]) await imageFile.makePublic();

          // const metadata = await imageFile.getMetadata();
          // const mediaLink = metadata[0].mediaLink;

          resolve(imageFile.publicUrl());
        } catch (error) {
          reject(error);
        }
      });
  });

const getImage = (req: NextApiRequest): Promise<string | null> =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });

    form.parse(req, (error, fields) => {
      if (error) {
        console.log("FORM ERROR", error);
        return reject(error);
      }
      resolve(fields.file.toString());
    });
  });

// const handler = nextConnect()
//   .use(multerUpload.single("file"))
//   .post(async (req: UploadReq, res: NextApiResponse) => {
//     try {
//       const fileName = req.query.fileName as string;

//       console.log(req.headers);

//       console.log("HELLO!!?!");

//       console.log("FUCKIN FILE", req.file);

//       if (!fileName) return res.status(404).end();

//       const imageString = null;

//       if (!imageString)
//         return res.status(200).json({
//           imageURL: "",
//         });

//       const imageURL = await imageWriteStream(fileName, imageString);

//       const response: SaveEmbedImageReturnType = {
//         imageURL: "",
//       };

//       res.status(200).json(response);
//     } catch (error) {
//       console.error(error?.message);
//       res.status(500).json({ error });
//     }
//   });

// export default handler;

export default async function saveEmbedImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fileName = req.query.fileName as string;
    const variant = req.query.variant as string;

    if (!fileName || !variant) return res.status(404).end();

    const imageString = await getImage(req);

    if (!imageString)
      return res.status(200).json({
        imageURL: "",
      });

    const imageURL = await imageWriteStream(fileName, variant, imageString);

    const response: SaveEmbedImageReturnType = {
      imageURL: imageURL,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error?.message);
    res.status(500).json({ error });
  }
}
