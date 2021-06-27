import { SeasonType } from "../types";
import EpisodeCard from "./EdisodeCard";

export default function SeasonContent(props: SeasonType) {
  const { seasonNumber, episodes } = props;

  return (
    <div className="p-2">
      <h4 className="text-white text-3xl font-semibold px-2">
        Season {seasonNumber}
      </h4>
      <div className="overflow-x-auto whitespace-nowrap overflow-y-hidden py-4">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.episodeNumber} {...episode} />
        ))}
      </div>
    </div>
  );
}
