import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ReviewType } from "../../types";
import {
  getMovieDbConfiguration,
  getMovieDbEndpoint,
  parseReviews,
} from "../../utils";

export type ReviewsMovieReturnType = {
  reviews: Array<ReviewType>;
};

export default async function recommendedTV(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.id as string;

    if (!id) return res.status(404).end();

    const movieDbConfig = await getMovieDbConfiguration();

    const reviews = await axios.get(getMovieDbEndpoint(`/movie/${id}/reviews`));

    const response: ReviewsMovieReturnType = {
      reviews: parseReviews(reviews.data.results, {
        baseURL: movieDbConfig.images.secure_base_url,
        avatarSize: movieDbConfig.images.profile_sizes[1],
      }),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
}
