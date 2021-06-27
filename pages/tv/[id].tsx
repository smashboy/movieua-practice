import { GetServerSideProps } from "next";
import axios from "axios";
import {
  getMovieDbConfiguration,
  getMovieDbEndpoint,
  parseImages,
  parseReviews,
  parseSeason,
  parseTV,
} from "../../utils";
import { SeasonType, TvMoviePagePropsType, TVPropsType } from "../../types";
import ContenderHeader from "../../components/ContentHeader";
import SeasonContent from "../../components/SeasonContent";

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

  return (
    <>
      <ContenderHeader
        title={title}
        description={description}
        genres={genres}
        backdrop={backdrop}
        videoURL={videoURL}
        rating={rating}
      />
      {seasons.map((season) => (
        <SeasonContent key={season.seasonNumber} {...season} />
      ))}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tvId = (context.params?.id as string) || null;

  if (!tvId)
    return {
      notFound: true,
    };

  const detailsEndpoint = getMovieDbEndpoint(`/tv/${tvId}`);
  const recommendedEndpoint = getMovieDbEndpoint(`/tv/${tvId}/recommendations`);
  const reviewsEndpoint = getMovieDbEndpoint(`/tv/${tvId}/reviews`);
  const imagesEndpoint = getMovieDbEndpoint(`/tv/${tvId}/images`);
  const videosEndpoint = getMovieDbEndpoint(`/tv/${tvId}/videos`);

  const movieDbConfig = await getMovieDbConfiguration();

  const details = await axios.get(detailsEndpoint);
  const images = await axios.get(imagesEndpoint);
  const videos = await axios.get(videosEndpoint);
  const recommended = await axios.get(recommendedEndpoint);
  const reviews = await axios.get(reviewsEndpoint);

  const seasons: Array<SeasonType> = [];

  for (const seasonData of details.data.seasons) {
    const seasonEndpoint = getMovieDbEndpoint(
      `/tv/${tvId}/season/${seasonData.season_number}`
    );

    const season = await axios.get(seasonEndpoint);

    console.log(season.data);

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
    recommended: parseTV(recommended.data.results, {
      baseURL: movieDbConfig.images.secure_base_url,
      posterSize: movieDbConfig.images.poster_sizes[3],
    }),
    reviews: parseReviews(reviews.data.results, {
      baseURL: movieDbConfig.images.secure_base_url,
      avatarSize: movieDbConfig.images.profile_sizes[1],
    }),
    seasons,
  };

  return {
    props,
  };
};
