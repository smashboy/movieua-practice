import { useRouter } from "next/router";
import useSWR from "swr";
import { ReviewsMovieReturnType } from "../pages/api/reviews-movie";
import DataLoader from "./DataLoader";
import ReviewCard from "./ReviewCard";

export default function ReviewsMovie() {
  const id = useRouter().query.id as string;

  const { data, error, isValidating } = useSWR<ReviewsMovieReturnType>(
    `/api/reviews-movie?id=${id}`
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
