import { FaPlay as PlayIcon } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { useRef } from "react";

export default function VideoPlayer(props: { videoURL: string | null }) {
  const { videoURL } = props;

  const [openPlayer, setOpenPlayer] = useState(false);
  const focusRef = useRef(null);

  return (
    <>
      {videoURL ? (
        <button
          onClick={() => setOpenPlayer(true)}
          className="text-white outline-none flex items-center bg-red-600 py-2 px-4 rounded-md mt-4 transition duration-150 transform-gpu hover:scale-110"
        >
          <PlayIcon className="mr-2" />
          Watch
        </button>
      ) : (
        <button
          onClick={() => setOpenPlayer(true)}
          className="text-white outline-none flex items-center bg-white py-2 px-4 rounded-md mt-4 transition duration-150 transform-gpu hover:scale-110"
        >
          Coming soon
        </button>
      )}
      <Dialog
        open={openPlayer}
        initialFocus={focusRef}
        onClose={() => setOpenPlayer(false)}
        className="fixed z-50 inset-0 overflow-hidden"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />
        <div className="flex justify-center items-center w-full h-full">
          <div ref={focusRef} className="absolute z-50">
            <ReactPlayer url={videoURL!} controls volume={0.25} />
          </div>
        </div>
      </Dialog>
    </>
  );
}
