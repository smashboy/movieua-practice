import Image from "next/image";
import { useState } from "react";
import { EpisodeType } from "../types";

export default function EpisodeCard(props: EpisodeType) {
  const { stillURL, number, name } = props;

  const [imageSrc, setImageSrc] = useState(stillURL);

  return (
    <div
      key={number}
      className="p-2 inline-block overflow-hidden cursor-pointer transition duration-300 transform-gp hover:scale-110"
      style={{ maxWidth: 243 }}
    >
      <Image
        className="rounded-md"
        src={imageSrc}
        onError={() => setImageSrc("/images/fallback.png")}
        alt={name}
        width={227}
        height={127}
      />
      <div className="text-white text-xl font-bold truncate">{name}</div>
      <div className="text-gray-400 text-sm font-semibold">
        Episode {number}
      </div>
    </div>
  );
}
