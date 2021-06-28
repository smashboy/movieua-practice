import { NextApiRequest, NextApiResponse } from "next";
// import chromium from "chrome-aws-lambda";
// import playwright from "playwright-core";
import playwright from "playwright-aws-lambda";
import stream from "stream";
import { getAbsoluteURL } from "../../utils";
import { storage } from "../../firebase";

export type GenerateEmbedReturnType = {
  image: string;
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

export default async function generateEmbed(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.id as string;
    const variant = req.query.variant as "movie" | "tv";

    if (!id || !variant) return res.status(404).end();

    // Start the browser with the AWS Lambda wrapper (chrome-aws-lambda)
    const browser = await playwright.launchChromium({ headless: true });

    // Create a page with the Open Graph image size best practise
    const page = await browser.newPage({
      viewport: {
        width: 1200,
        height: 630,
      },
    });

    // Generate the full URL out of the given path (GET parameter)
    const embedURL = getAbsoluteURL(`/embed/${variant}/${id}`);

    await page.goto(embedURL, {
      timeout: 15 * 1000,
    });
    const data = await page.screenshot({
      type: "png",
    });
    await browser.close();

    // Set the s-maxage property which caches the images then on the Vercel edge
    res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
    res.setHeader("Content-Type", "image/png");

    const imageURL = await imageWriteStream(
      `embed-${variant}-${id}.png`,
      data.toString("base64")
    );

    const response: GenerateEmbedReturnType = {
      image: imageURL,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
