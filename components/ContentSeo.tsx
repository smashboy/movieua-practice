import { NextSeo } from "next-seo";

export default function ContentSeo(props: {
  title: string;
  description: string;
  embedImage: string;
  url: string;
}) {
  const { title, description, url, embedImage } = props;

  return (
    <NextSeo
      title={`${title} | MOVIEUA`}
      description={description}
      twitter={{
        cardType: "summary_large_image",
        site: "@smashboyhere"
      }}
      openGraph={{
        url,
        title,
        description,
        site_name: "MOVIEUA",
        locale: "en_US",
        type: "website",
        images: [
          {
            url: embedImage,
            width: 1200,
            height: 630,
            alt: `${title} | MOVIEUA`,
          },
        ],
      }}
    />
  );
}
