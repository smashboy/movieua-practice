import { useRouter } from "next/router";
import useSWR from "swr";
import { ReviewsTVReturnType } from "../pages/api/reviews-tv";
import DataLoader from "./DataLoader";
import ReviewCard from "./ReviewCard";

export default function ReviewsTV() {
  const id = useRouter().query.id as string;

  const { data, error, isValidating } = useSWR<ReviewsTVReturnType>(
    `/api/reviews-tv?id=${id}`
  );

  return (
    <DataLoader isLoading={isValidating} error={error}>
      <div className="w-full flex justify-center mt-20">
        <div className="grid grid-cols-1 gap-5 w-full lg:w-2/3">
          {data?.reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </DataLoader>
  );
}
