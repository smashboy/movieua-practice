import axios from "axios";
import { GetServerSideProps } from "next";
import { EmbedPreviewType } from "../../../types";
import {
  getMovieDbConfiguration,
  getMovieDbEndpoint,
  parseImages,
} from "../../../utils";
import Embed from "../../../components/Embed";

export default function MovieEmbed(props: EmbedPreviewType) {
  return <Embed {...props} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = (context.params?.id as string) || null;

  if (!id)
    return {
      notFound: true,
    };

  const movieDbConfig = await getMovieDbConfiguration();

  const details = await axios.get(getMovieDbEndpoint(`/movie/${id}`));
  const images = await axios.get(getMovieDbEndpoint(`/movie/${id}/images`));

  const props: EmbedPreviewType = {
    title: details.data.original_title,
    description: details.data.overview || "",
    posterURL: `${movieDbConfig.images.secure_base_url}${movieDbConfig.images.poster_sizes[3]}${details.data.poster_path}`,
    rating: details.data.vote_average,
    backdrop: parseImages(images.data.backdrops, {
      baseURL: movieDbConfig.images.secure_base_url,
      backdropSize: movieDbConfig.images.backdrop_sizes[2],
    }),
  };

  return {
    props,
  };
};
