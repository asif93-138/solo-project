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

export interface MovieDetails extends Movie {
  user: string, // Name of person who added movie
  rating: number,
  rr: {
    rr_id: number;
    user_id: number;
    user: string; // Name of person who added review
    rating: number;
    review: string
  }[];
}
