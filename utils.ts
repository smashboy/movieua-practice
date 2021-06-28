import axios from "axios";
import { MovieType } from "./pages/api/discover-movies";
import { TvType } from "./pages/api/discover-tv";
import { DiscoverItemType, ReviewType, SeasonType } from "./types";

export const getMovieDbEndpoint = (
  endpoint: string,
  query?: Array<{ key: string; value: string }>
) => {
  const searchParams = new URLSearchParams();

  searchParams.set("api_key", process.env.MOVIEDB_API_KEY as string);

  query = query || [];

  query.forEach(({ key, value }) => searchParams.set(key, value));

  const queryString = searchParams.toString();

  return `https://api.themoviedb.org/3${endpoint}?${queryString}`;
};

export const assert = (condition: any, message: string) => {
  if (!condition) throw new Error(message);
};

export const getMovieDbConfiguration = async () => {
  const endpoint = getMovieDbEndpoint("/configuration");

  const configuration = await axios.get(endpoint);

  return configuration.data;
};

export const parseTV = (
  list: Array<TvType>,
  config: { baseURL: string; posterSize: string }
): Array<DiscoverItemType> =>
  list.map(({ id, original_name, overview, poster_path, vote_average }) => ({
    id,
    title: original_name,
    description: overview,
    posterURL: `${config.baseURL}${config.posterSize}${poster_path}`,
    rating: vote_average,
  }));

export const parseMovies = (
  list: Array<MovieType>,
  config: { baseURL: string; posterSize: string }
): Array<DiscoverItemType> =>
  list.map(({ id, original_title, overview, poster_path, vote_average }) => ({
    id,
    title: original_title,
    description: overview,
    posterURL: `${config.baseURL}${config.posterSize}${poster_path}`,
    rating: vote_average,
  }));

export const parseImages = (
  images: Array<{ file_path: string }>,
  config: { baseURL: string; backdropSize: string }
): string | null => {
  const index = random(0, images.length - 1);
  const image = images[index];
  if (!image) return null;
  return `${config.baseURL}${config.backdropSize}${image.file_path}`;
};

export const parseVideos = (
  videos: Array<{ type: String; key: string; site: string }>
): string | null =>
  videos
    .filter(
      (video: { type: String; key: string; site: string }) =>
        (video.type === "Teaser" || video.type === "Trailer") &&
        video.site === "YouTube"
    )
    .map(
      (video: { type: String; key: string }) =>
        `https://www.youtube.com/watch?v=${video.key}`
    )[0] || null;

export const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

export const parseReviews = (
  reviews: Array<{
    author_details: { username: string; avatar_path: string; rating: number };
    content: string;
    created_at: string;
  }>,
  config: { baseURL: string; avatarSize: string }
): Array<ReviewType> =>
  reviews.map((review) => ({
    username: review.author_details.username,
    avatarURL: `${config.baseURL}${config.avatarSize}${review.author_details.avatar_path}`,
    rating: review.author_details.rating,
    content: review.content,
    createdAt: review.created_at,
  }));

export const parseSeason = (
  season: {
    season_number: number;
    name: string;
    episodes: Array<{
      name: string;
      episode_number: number;
      still_path: string;
    }>;
  },
  config: { baseURL: string; stillSize: string }
): SeasonType => ({
  name: season.name,
  number: season.season_number,
  episodes: season.episodes.map((episode) => ({
    name: episode.name,
    number: episode.episode_number,
    stillURL: `${config.baseURL}${config.stillSize}${episode.still_path}`,
  })),
});

export const getAbsoluteURL = (path: string) => {
  const baseURL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  return `${baseURL}${path}`;
};
