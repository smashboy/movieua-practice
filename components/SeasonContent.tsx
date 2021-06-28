import { SeasonType } from "../types";
import EpisodeCard from "./EdisodeCard";

export default function SeasonContent(props: SeasonType) {
  const { number, episodes, name } = props;

  return (
    <>
      <h4 className="text-white text-3xl font-semibold px-2">
        {number === 0 ? name : `Season ${number}`}
      </h4>
      <div className="overflow-x-auto whitespace-nowrap overflow-y-hidden py-4">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.number} {...episode} />
        ))}
      </div>
    </>
  );
}
