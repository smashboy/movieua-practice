import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { DiscoverItemType } from "../../types";
import {
  getMovieDbConfiguration,
  getMovieDbEndpoint,
  parseTV,
} from "../../utils";

export type RecommendedTVReturnType = {
  recommended: Array<DiscoverItemType>;
};

export default async function recommendedTV(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.id as string;

    if (!id) return res.status(404).end();

    const movieDbConfig = await getMovieDbConfiguration();

    const recommended = await axios.get(
      getMovieDbEndpoint(`/tv/${id}/recommendations`)
    );

    const response: RecommendedTVReturnType = {
      recommended: parseTV(recommended.data.results, {
        baseURL: movieDbConfig.images.secure_base_url,
        posterSize: movieDbConfig.images.poster_sizes[3],
      }),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
}
