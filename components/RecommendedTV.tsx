import { useRouter } from "next/router";
import useSWR from "swr";
import { RecommendedTVReturnType } from "../pages/api/recommended-tv";
import DataLoader from "./DataLoader";
import DiscoverGrid from "./DiscoverGrid";
import DiscoverCard from "./DiscoverCard";

export default function RecommendedTV() {
  const id = useRouter().query.id as string;

  const { data, error, isValidating } = useSWR<RecommendedTVReturnType>(
    `/api/recommended-tv?id=${id}`
  );

  return (
    <DataLoader isLoading={isValidating} error={error}>
      <DiscoverGrid>
        {data?.recommended.map((tv) => (
          <DiscoverCard key={tv.id} variant="tv" {...tv} />
        ))}
      </DiscoverGrid>
    </DataLoader>
  );
}
