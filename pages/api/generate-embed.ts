import { NextApiRequest, NextApiResponse } from "next";
import chromium from "chrome-aws-lambda";
import playwright from "playwright-core";
import { getAbsoluteURL } from "../../utils";
import axios from "axios";
import { SaveEmbedImageReturnType } from "./save-embed-image";

export type GenerateEmbedReturnType = {
  image: string;
};

export default async function generateEmbed(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.id as string;
    const variant = req.query.variant as "movie" | "tv";

    if (!id || !variant) return res.status(404).end();

    const execPath = await chromium.executablePath;

    // Start the browser with the AWS Lambda wrapper (chrome-aws-lambda)
    const browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath: execPath,
      headless: chromium.headless,
    });

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
    // res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
    // res.setHeader("Content-Type", "image/png");

    const imageSearchParams = new URLSearchParams();
    imageSearchParams.set("fileName", `embed-${variant}-${id}.png`);

    const body = new FormData();
    body.append("image", data.toString("base64"));

    const imageResponse = await axios.get<SaveEmbedImageReturnType>(
      getAbsoluteURL(`/api/save-embed-image?${imageSearchParams.toString()}`),
      {
        data: body,
      }
    );

    const response: GenerateEmbedReturnType = {
      image: imageResponse.data.imageURL,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
