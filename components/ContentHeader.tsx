import Image from "next/image";
import { FaStar as StarIcon } from "react-icons/fa";
import VideoPlayer from "./VideoPlayer";

export default function ContentHeader(props: {
  title: string;
  description: string;
  rating: number;
  genres: Array<string>;
  videoURL: string | null;
  backdrop: string | null;
}) {
  const { title, description, rating, genres, backdrop, videoURL } = props;

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
        <VideoPlayer videoURL={videoURL} />
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
