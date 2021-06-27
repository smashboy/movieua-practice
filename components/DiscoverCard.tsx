import NextLink from "next/link";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import { DiscoverItemType } from "../types";
import { useState } from "react";
import { FaStar as StarIcon } from "react-icons/fa";
import clsx from "clsx";

export default function DiscoverCard(
  props: DiscoverItemType & { variant: "movie" | "tv" }
) {
  const { id, title, rating, description, posterURL, variant } = props;

  const [showInfo, setShowInfo] = useState(false);

  return (
    <NextLink href={`/${variant}/${id}`} passHref>
      <a className="relative hover:z-10 group">
        <div
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          className={clsx(
            "flex justify-center rounded-sm overflow-hidden group-hover:rounded-3xl shadow-md",
            showInfo && "shadow-2xl"
          )}
        >
          <Image
            className={clsx(
              "relative transition duration-300 transform-gpu group-hover:scale-125",
              showInfo && "absolute z-20"
            )}
            src={posterURL}
            alt={title}
            width={207}
            height={310}
          />
          <Transition
            show={showInfo}
            enterFrom="opacity-0"
            enter="transition-opacity duration-300"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="absolute p-6 inset-0 shadow-lg -left-10 -top-12 rounded-md bg-gray-900"
              style={{
                width: 700,
                height: 225,
              }}
              onMouseLeave={() => setShowInfo(false)}
            >
              <div className="flex justify-end">
                <div className="w-2/3">
                  <h2 className="text-3xl font-bold overflow-ellipsis text-white overflow-hidden whitespace-nowrap">
                    {title}
                  </h2>
                  <p
                    className="text-gray-400 overflow-ellipsis overflow-hidden h-full"
                    style={{ maxHeight: 120 }}
                  >
                    {description}
                  </p>
                  <div className="flex mt-2 w-full items-center justify-end">
                    <StarIcon color="gold" />{" "}
                    <span className="ml-2 text-white">{`${rating} / 10`}</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </a>
    </NextLink>
  );
}
