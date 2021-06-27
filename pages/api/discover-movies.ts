import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getMovieDbConfiguration, getMovieDbEndpoint } from "../../utils";
import { DiscoverItemType } from "../../types";

export type DiscoverMoviesReturnType = {
  movies: Array<DiscoverItemType>;
};

export type MovieType = {
  id: number;
  original_title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
};

export default async function discoverMovies(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const endpoint = getMovieDbEndpoint("/discover/movie", [
      { key: "sort_by", value: "popularity.desc" },
    ]);

    const movies = await axios.get(endpoint);
    const movieDbConfig = await getMovieDbConfiguration();

    const parsedMovies: Array<DiscoverItemType> = movies.data.results.map(
      ({
        id,
        original_title,
        overview,
        poster_path,
        vote_average,
      }: MovieType) => ({
        id,
        title: original_title,
        description: overview,
        posterURL: `${movieDbConfig.images.secure_base_url}${movieDbConfig.images.poster_sizes[3]}${poster_path}`,
        rating: vote_average,
      })
    );

    const response: DiscoverMoviesReturnType = { movies: parsedMovies };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
