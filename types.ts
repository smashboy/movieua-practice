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
};

export type EpisodeType = {
  name: string;
  number: number;
  stillURL: string;
};

export type SeasonType = {
  number: number;
  name: string;
  episodes: Array<EpisodeType>;
};

export type TVPropsType = {
  seasons: Array<SeasonType>;
};

export type MoviePropsType = {
  recommended: Array<DiscoverItemType>;
};

export type SectionSelectorType = "recommended" | "watch" | "reviews";
