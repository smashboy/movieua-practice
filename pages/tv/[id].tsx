import { GetServerSideProps } from "next";
import axios from "axios";
import {
  getMovieDbConfiguration,
  getMovieDbEndpoint,
  parseImages,
  parseSeason,
} from "../../utils";
import { SeasonType, TvMoviePagePropsType, TVPropsType } from "../../types";
import ContentHeader from "../../components/ContentHeader";
import SeasonContent from "../../components/SeasonContent";
import { useState } from "react";
import TabContentAnimation from "../../components/TabContentAnimation";
import clsx from "clsx";
import RecommendedTV from "../../components/RecommendedTV";
import ReviewsTV from "../../components/ReviewsTV";

export default function TVPage(props: TvMoviePagePropsType & TVPropsType) {
  const {
    title,
    description,
    posterURL,
    rating,
    genres,
    backdrop,
    videoURL,
    seasons,
  } = props;

  const [selectedSection, setSelectedSection] = useState<
    "recommended" | "watch" | "reviews"
  >("watch");

  return (
    <>
      <ContentHeader
        title={title}
        description={description}
        genres={genres}
        backdrop={backdrop}
        videoURL={videoURL}
        rating={rating}
      />
      <div className="flex w-full justify-center mt-10">
        <button
          onClick={() => setSelectedSection("watch")}
          className={clsx(
            "text-white py-2 px-4 outline-none bg-gray-900 rounded-md transition duration-150 transform-gpu",
            selectedSection === "watch" && "bg-red-600 scale-110"
          )}
        >
          WATCH
        </button>
        <button
          onClick={() => setSelectedSection("recommended")}
          className={clsx(
            "text-white py-2 px-4 outline-none bg-gray-900 ml-4 rounded-md transition duration-150 transform-gpu",
            selectedSection === "recommended" && "bg-red-600 scale-110"
          )}
        >
          RECOMMENDED
        </button>
        <button
          onClick={() => setSelectedSection("reviews")}
          className={clsx(
            "ml-4 text-white py-2 px-4 outline-none bg-gray-900 rounded-md transition duration-150 transform-gpu",
            selectedSection === "reviews" && "bg-red-600 scale-110"
          )}
        >
          REVIEWS
        </button>
      </div>
      <div className="py-2 px-10">
        <TabContentAnimation show={selectedSection === "watch"}>
          {seasons.map((season) => (
            <SeasonContent key={season.number} {...season} />
          ))}
        </TabContentAnimation>
        <TabContentAnimation show={selectedSection === "recommended"}>
          <RecommendedTV />
        </TabContentAnimation>
        <TabContentAnimation show={selectedSection === "reviews"}>
          <ReviewsTV />
        </TabContentAnimation>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tvId = (context.params?.id as string) || null;

  if (!tvId)
    return {
      notFound: true,
    };

  const movieDbConfig = await getMovieDbConfiguration();

  const details = await axios.get(getMovieDbEndpoint(`/tv/${tvId}`));
  const images = await axios.get(getMovieDbEndpoint(`/tv/${tvId}/images`));
  const videos = await axios.get(getMovieDbEndpoint(`/tv/${tvId}/videos`));

  const seasons: Array<SeasonType> = [];

  for (const seasonData of details.data.seasons) {
    const seasonEndpoint = getMovieDbEndpoint(
      `/tv/${tvId}/season/${seasonData.season_number}`
    );

    const season = await axios.get(seasonEndpoint);

    seasons.push(
      parseSeason(season.data, {
        baseURL: movieDbConfig.images.secure_base_url,
        stillSize: movieDbConfig.images.still_sizes[2],
      })
    );
  }

  const props: TvMoviePagePropsType & TVPropsType = {
    title: details.data.original_name,
    description: details.data.overview,
    posterURL: `${movieDbConfig.images.secure_base_url}${movieDbConfig.images.poster_sizes[3]}${details.data.poster_path}`,
    rating: details.data.vote_average,
    genres: details.data.genres.map(
      (genre: { name: string }) => genre.name as string
    ),
    // TODO URL
    videoURL:
      videos.data.results
        .filter(
          (video: { type: String; key: string; site: string }) =>
            (video.type === "Teaser" || video.type === "Trailer") &&
            video.site === "YouTube"
        )
        .map((video: { type: String; key: string }) => video.key)[0] || null,
    backdrop: parseImages(images.data.backdrops, {
      baseURL: movieDbConfig.images.secure_base_url,
      backdropSize: movieDbConfig.images.backdrop_sizes[2],
    }),
    seasons,
  };

  return {
    props,
  };
};
