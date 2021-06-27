import clsx from "clsx";
import { useState } from "react";
import DiscoverAnimation from "../components/DiscoverAnimation";
import DiscoverMovies from "../components/DiscoverMovies";
import DiscoverTV from "../components/DiscoverTV";

export default function Home() {
  const [selectedDiscover, setSelectedDiscover] = useState<"movies" | "tv">(
    "movies"
  );

  return (
    <div className="flex justify-center w-full">
      <div className="w-full px-6">
        <h1 className="text-3xl font-bold text-white text-center">DISCOVER</h1>
        <div className="flex w-full justify-center mt-10">
          <button
            onClick={() => setSelectedDiscover("movies")}
            className={clsx(
              "text-white py-2 px-4 bg-gray-900 rounded-md transition duration-150 transform-gpu",
              selectedDiscover === "movies" && "bg-red-600 scale-110"
            )}
          >
            MOVIES
          </button>
          <button
            onClick={() => setSelectedDiscover("tv")}
            className={clsx(
              "ml-4 text-white py-2 px-4 bg-gray-900 rounded-md transition duration-150 transform-gpu",
              selectedDiscover === "tv" && "bg-red-600 scale-110"
            )}
          >
            TV
          </button>
        </div>
        <DiscoverAnimation show={selectedDiscover === "movies"}>
          <DiscoverMovies />
        </DiscoverAnimation>
        <DiscoverAnimation show={selectedDiscover === "tv"}>
          <DiscoverTV />
        </DiscoverAnimation>
      </div>
    </div>
  );
}
