export type DiscoverItemType = {
  id: number;
  title: string;
  description: string;
  posterURL: string;
  rating: number;
};

export type ReviewType = {
  username: string;
  avatarURL: string | null;
  rating: number;
  content: string;
  createdAt: string;
};

export type TvMoviePagePropsType = {
  title: string;
  description: string;
  posterURL: string;
  rating: number;
  genres: Array<string>;
  videoURL: string | null;
  backdrop: string | null;
  reviews: Array<ReviewType>;
  recommended: Array<DiscoverItemType>;
};

export type SeasonType = {
  seasonNumber: number;
  episodes: Array<{
    name: string;
    episodeNumber: number;
    stillURL: string;
  }>;
};

export type TVPropsType = {
  seasons: Array<SeasonType>;
};
