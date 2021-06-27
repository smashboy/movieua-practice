import useSWR from "swr";
import DataLoader from "../components/DataLoader";
import DiscoverCard from "../components/DiscoverCard";
import DiscoverGrid from "../components/DiscoverGrid";
import { DiscoverTvReturnType } from "../pages/api/discover-tv";

export default function DiscoverTV() {
  const { data, error, isValidating } =
    useSWR<DiscoverTvReturnType>("/api/discover-tv");

  return (
    <DataLoader isLoading={isValidating} error={error}>
      <DiscoverGrid>
        {/* {data?.movies &&
          [data.movies[0]].map((movie) => (
            <DiscoverCard key={movie.id} {...movie} />
          ))} */}
        {data?.tvSeries.map((series) => (
          <DiscoverCard variant="tv" key={series.id} {...series} />
        ))}
      </DiscoverGrid>
    </DataLoader>
  );
}
