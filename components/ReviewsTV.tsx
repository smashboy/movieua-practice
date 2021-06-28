import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import { FaStar as StarIcon } from "react-icons/fa";
import { ReviewsTVReturnType } from "../pages/api/reviews-tv";
import DataLoader from "./DataLoader";

export default function ReviewsTV() {
  const id = useRouter().query.id as string;

  const { data, error, isValidating } = useSWR<ReviewsTVReturnType>(
    `/api/reviews-tv?id=${id}`
  );

  console.log(data);

  return (
    <DataLoader isLoading={isValidating} error={error}>
      <div className="w-full flex justify-center mt-20">
        <div className="grid grid-cols-1 gap-5 w-full lg:w-2/3">
          {data?.reviews.map(
            ({ username, avatarURL, rating, content, createdAt }, index) => (
              <div
                key={index}
                className="p-4 rounded-md shadow-lg bg-gray-900 grid grid-cols-4"
              >
                <div className="col-span-1 flex justify-center items-center flex-wrap">
                  <Image
                    src={avatarURL || "/images/avatar-fallback.png"}
                    alt={username}
                    width={125}
                    height={125}
                    className="rounded-full"
                  />
                  <div className="flex justify-center w-full">
                    <StarIcon color="gold" />
                    <span className="ml-2 text-white">{`${rating} / 10`}</span>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="text-xl text-red-600">{username}</div>
                  <p className="text-white mt-2">{content}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </DataLoader>
  );
}
