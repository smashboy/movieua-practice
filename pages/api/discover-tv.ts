import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import {
  getMovieDbConfiguration,
  getMovieDbEndpoint,
  parseTV,
} from "../../utils";
import { DiscoverItemType } from "../../types";

export type DiscoverTvReturnType = {
  tvSeries: Array<DiscoverItemType>;
};

export type TvType = {
  id: number;
  original_name: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
};

export default async function discoverTV(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const endpoint = getMovieDbEndpoint("/discover/tv", [
      { key: "sort_by", value: "popularity.desc" },
    ]);

    const tv = await axios.get(endpoint);
    const movieDbConfig = await getMovieDbConfiguration();

    const parsedTvSeries = parseTV(tv.data.results, {
      baseURL: movieDbConfig.images.secure_base_url,
      posterSize: movieDbConfig.images.poster_sizes[3],
    });

    const response: DiscoverTvReturnType = { tvSeries: parsedTvSeries };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
