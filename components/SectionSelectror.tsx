import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";
import { SectionSelectorType } from "../types";

export default function SectionSelector(props: {
  value: SectionSelectorType;
  setSection: Dispatch<SetStateAction<SectionSelectorType>>;
  disableWatch?: boolean;
}) {
  const { value, setSection, disableWatch } = props;

  return (
    <div className="flex w-full justify-center mt-10">
      {!disableWatch && (
        <button
          onClick={() => setSection("watch")}
          className={clsx(
            "text-white py-2 px-4 outline-none bg-gray-900 rounded-md transition duration-150 transform-gpu",
            value === "watch" && "bg-red-600 scale-110"
          )}
        >
          WATCH
        </button>
      )}
      <button
        onClick={() => setSection("recommended")}
        className={clsx(
          "text-white py-2 px-4 outline-none bg-gray-900 ml-4 rounded-md transition duration-150 transform-gpu",
          value === "recommended" && "bg-red-600 scale-110"
        )}
      >
        RECOMMENDED
      </button>
      <button
        onClick={() => setSection("reviews")}
        className={clsx(
          "ml-4 text-white py-2 px-4 outline-none bg-gray-900 rounded-md transition duration-150 transform-gpu",
          value === "reviews" && "bg-red-600 scale-110"
        )}
      >
        REVIEWS
      </button>
    </div>
  );
}
