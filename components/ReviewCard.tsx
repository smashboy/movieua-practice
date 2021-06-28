import Image from "next/image";
import { useState } from "react";
import { FaStar as StarIcon } from "react-icons/fa";
import { ReviewType } from "../types";

const fallbackAvatarURL = "/images/avatar-fallback.png";

export default function ReviewCard(props: ReviewType) {
  const { avatarURL, username, rating, content } = props;

  const [imageSrc, setImageSrc] = useState(avatarURL || fallbackAvatarURL);

  return (
    <div className="p-4 rounded-md shadow-lg bg-gray-900 grid grid-cols-4">
      <div className="col-span-1 flex justify-center items-center flex-wrap">
        <Image
          src={imageSrc}
          alt={username}
          onError={() => setImageSrc(fallbackAvatarURL)}
          width={125}
          height={125}
          className="rounded-full"
        />
        <div className="flex justify-center w-full">
          <StarIcon color="gold" />
          <span className="ml-2 text-white">{`${rating} / 10`}</span>
        </div>
      </div>
      <div className="col-span-3">
        <div className="text-xl text-red-600">{username}</div>
        <p className="text-white mt-2">{content}</p>
      </div>
    </div>
  );
}
