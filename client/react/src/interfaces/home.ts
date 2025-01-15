export interface Movie {
  movie_id: number;
  user_id: number;
  title: string;
  img: string;
  desc: string;
  release_yr: number;
  director: string;
  length: number;
  producer: string;
  averageRating: number;
  genres: { genre: string }[];
}

export interface Genre {
    genre_id: number;
    genre: string;
  }

export interface MovieCardsProps {
  dataObj: Movie[];
}