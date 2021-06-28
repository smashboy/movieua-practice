import Image from "next/image";
import { FaStar as StarIcon } from "react-icons/fa";
import { EmbedPreviewType } from "../types";

export default function Embed(props: EmbedPreviewType) {
  const { title, description, posterURL, rating, backdrop } = props;

  return (
    <div
      className="border-8 border-gray-900 rounded-lg py-8 pl-8 relative grid grid-cols-12"
      style={{ width: 1200, height: 630 }}
    >
      <div className="col-span-4 pt-8">
        <div
          className="w-auto absolute left-0 bottom-0 ml-4 mb-4"
          style={{ height: 140 }}
        >
          <Image
            src={posterURL}
            alt={title}
            width={87}
            height={140}
            layout="fixed"
            className="rounded-lg"
          />
        </div>
        <div className="flex flex-wrap items-start w-full">
          <div className="w-full flex items-center">
            <div className="text-white text-8xl font-bold h-auto">{title}</div>
            <div className="flex items-center justify-center ml-5 pt-5">
              <StarIcon color="gold" />
              <span className="ml-2 text-white">{`${rating} / 10`}</span>
            </div>
          </div>
          <div
            className="text-gray-400 overflow-ellipsis overflow-hidden w-full mt-4"
            style={{ maxHeight: 120 }}
          >
            {description}
          </div>
        </div>
      </div>
      <div className="aspect-w-16 aspect-h-9 w-full relative col-span-8 -mt-8">
        <div
          className="absolute inset-0 z-10"
          style={{ boxShadow: "0px 0px 25px 55px rgb(0, 0, 0) inset" }}
        />
        {backdrop && <Image src={backdrop} alt={title} layout="fill" />}
      </div>
      <div className="absolute text-red-600 z-50 right-0 bottom-0 font-bold text-4xl pr-4 pb-4">
        MOVIEUA
      </div>
    </div>
  );
}
