import useSWR from "swr";
import DataLoader from "../components/DataLoader";
import DiscoverCard from "../components/DiscoverCard";
import DiscoverGrid from "../components/DiscoverGrid";
import { DiscoverMoviesReturnType } from "../pages/api/discover-movies";

export default function DiscoverMovies() {
  const { data, error, isValidating } = useSWR<DiscoverMoviesReturnType>(
    "/api/discover-movies"
  );

  return (
    <DataLoader isLoading={isValidating} error={error}>
      <DiscoverGrid>
        {/* {data?.movies &&
          [data.movies[0]].map((movie) => (
            <DiscoverCard key={movie.id} {...movie} />
          ))} */}
        {data?.movies.map((movie) => (
          <DiscoverCard key={movie.id} variant="movie" {...movie} />
        ))}
      </DiscoverGrid>
    </DataLoader>
  );
}
