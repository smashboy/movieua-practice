import Image from "next/image";
import { FaPlay as PlayIcon, FaStar as StarIcon } from "react-icons/fa";

export default function ContentHeader(props: {
  title: string;
  description: string;
  rating: number;
  genres: Array<string>;
  videoURL: string | null;
  backdrop: string | null;
}) {
  const { title, description, rating, genres, backdrop } = props;

  return (
    <div className="relative flex -mt-16">
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ boxShadow: "0px 0px 50px 10px rgb(0, 0, 0) inset" }}
      />
      <div className="w-5/12 p-6">
        <div className="flex items-center mt-28">
          <h1 className="text-white text-6xl font-bold">{title}</h1>
          <div className="flex items-center justify-center ml-5 mt-3">
            <StarIcon color="gold" />
            <span className="ml-2 text-white">{`${rating} / 10`}</span>
          </div>
        </div>
        <p className="text-gray-400 text-justify mt-6">{description}</p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {genres.map((genre) => (
            <div
              key={genre}
              className="bg-gray-900 rounded-md text-white p-1 flex justify-center items-center cursor-default"
            >
              {genre}
            </div>
          ))}
        </div>
        <button className="text-white outline-none flex items-center bg-red-600 py-2 px-4 rounded-md mt-4 transition duration-150 transform-gpu hover:scale-110">
          <PlayIcon className="mr-2" />
          Watch
        </button>
      </div>
      <div className="flex w-7/12 justify-end">
        <div className="aspect-w-16 aspect-h-9 w-full relative">
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ boxShadow: "0px 0px 25px 55px rgb(0, 0, 0) inset" }}
          />
          {backdrop && (
            <Image src={backdrop} alt={title} width={1920} height={1080} />
          )}
        </div>
      </div>
    </div>
  );
}
