import { GetServerSideProps } from "next";
import axios from "axios";
import {
  getAbsoluteURL,
  getMovieDbConfiguration,
  getMovieDbEndpoint,
  parseImages,
  parseSeason,
  parseVideos,
} from "../../utils";
import {
  SeasonType,
  SectionSelectorType,
  TvMoviePagePropsType,
  TVPropsType,
} from "../../types";
import ContentHeader from "../../components/ContentHeader";
import SeasonContent from "../../components/SeasonContent";
import { useState } from "react";
import TabContentAnimation from "../../components/TabContentAnimation";
import RecommendedTV from "../../components/RecommendedTV";
import ReviewsTV from "../../components/ReviewsTV";
import SectionSelector from "../../components/SectionSelectror";
import Navigation from "../../components/Navigation";
import { GenerateEmbedReturnType } from "../api/generate-embed";
import ContentSeo from "../../components/ContentSeo";

export default function TVPage(props: TvMoviePagePropsType & TVPropsType) {
  const {
    title,
    description,
    rating,
    genres,
    backdrop,
    videoURL,
    seasons,
    embedPreview,
    url,
  } = props;

  const [selectedSection, setSelectedSection] =
    useState<SectionSelectorType>("watch");

  return (
    <>
      <ContentSeo
        title={title}
        description={description}
        embedImage={embedPreview}
        url={url}
      />
      <Navigation />
      <ContentHeader
        title={title}
        description={description}
        genres={genres}
        backdrop={backdrop}
        videoURL={videoURL}
        rating={rating}
      />
      <SectionSelector
        value={selectedSection}
        setSection={setSelectedSection}
      />
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
  const id = (context.params?.id as string) || null;

  if (!id)
    return {
      notFound: true,
    };

  const searchParams = new URLSearchParams();
  searchParams.set("id", id);
  searchParams.set("variant", "movie");

  const embed = await axios.get<GenerateEmbedReturnType>(
    getAbsoluteURL(`/api/generate-embed?${searchParams.toString()}`)
  );

  const movieDbConfig = await getMovieDbConfiguration();

  const details = await axios.get(getMovieDbEndpoint(`/tv/${id}`));
  const images = await axios.get(getMovieDbEndpoint(`/tv/${id}/images`));
  const videos = await axios.get(getMovieDbEndpoint(`/tv/${id}/videos`));

  const seasons: Array<SeasonType> = [];

  for (const seasonData of details.data.seasons) {
    const seasonEndpoint = getMovieDbEndpoint(
      `/tv/${id}/season/${seasonData.season_number}`
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
    url: getAbsoluteURL(`/tv/${id}`),
    embedPreview: embed.data.image,
    posterURL: `${movieDbConfig.images.secure_base_url}${movieDbConfig.images.poster_sizes[3]}${details.data.poster_path}`,
    rating: details.data.vote_average,
    genres: details.data.genres.map(
      (genre: { name: string }) => genre.name as string
    ),
    videoURL: parseVideos(videos.data.results),
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
