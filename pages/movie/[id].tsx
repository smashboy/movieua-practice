import axios from "axios";
import { GetStaticProps, GetStaticPaths } from "next";
import { useState } from "react";
import {
  MoviePropsType,
  SectionSelectorType,
  TvMoviePagePropsType,
} from "../../types";
import {
  getAbsoluteURL,
  getMovieDbConfiguration,
  getMovieDbEndpoint,
  parseImages,
  parseMovies,
  parseVideos,
} from "../../utils";
import { MovieType } from "../api/discover-movies";
import ContentHeader from "../../components/ContentHeader";
import SectionSelector from "../../components/SectionSelectror";
import TabContentAnimation from "../../components/TabContentAnimation";
import DiscoverGrid from "../../components/DiscoverGrid";
import DiscoverCard from "../../components/DiscoverCard";
import ReviewsMovie from "../../components/ReviewsMovie";
import Navigation from "../../components/Navigation";
import { GenerateEmbedReturnType } from "../api/generate-embed";
import ContentSeo from "../../components/ContentSeo";

export default function MoviePage(
  props: TvMoviePagePropsType & MoviePropsType
) {
  const {
    title,
    description,
    rating,
    genres,
    backdrop,
    videoURL,
    recommended,
    embedPreview,
    url,
  } = props;

  const [selectedSection, setSelectedSection] =
    useState<SectionSelectorType>("recommended");

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
        disableWatch
      />
      <div className="py-2 px-10">
        <TabContentAnimation show={selectedSection === "recommended"}>
          <DiscoverGrid>
            {recommended.map((movie) => (
              <DiscoverCard key={movie.id} variant="movie" {...movie} />
            ))}
          </DiscoverGrid>
        </TabContentAnimation>
        <TabContentAnimation show={selectedSection === "reviews"}>
          <ReviewsMovie />
        </TabContentAnimation>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
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

  const details = await axios.get(getMovieDbEndpoint(`/movie/${id}`));
  const images = await axios.get(getMovieDbEndpoint(`/movie/${id}/images`));
  const videos = await axios.get(getMovieDbEndpoint(`/movie/${id}/videos`));
  const recommended = await axios.get(
    getMovieDbEndpoint(`/movie/${id}/recommendations`)
  );

  const props: TvMoviePagePropsType & MoviePropsType = {
    title: details.data.original_title,
    description: details.data.overview || "",
    url: getAbsoluteURL(`/movie/${id}`),
    embedPreview: embed.data.image || "",
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
    recommended: parseMovies(recommended.data.results, {
      baseURL: movieDbConfig.images.secure_base_url,
      posterSize: movieDbConfig.images.poster_sizes[3],
    }),
  };

  return {
    props,
    revalidate: 60 * 60, // Revalidate each hour
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const endpoint = getMovieDbEndpoint("/discover/movie", [
    { key: "sort_by", value: "popularity.desc" },
  ]);

  const movies = await axios.get(endpoint);

  const paths = movies.data.results.map(({ id }: MovieType) => ({
    params: { id: `${id}` },
  }));

  return { paths, fallback: "blocking" };
};
