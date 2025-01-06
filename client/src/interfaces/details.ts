export interface Movie {
    movie_id: number;
    user_id: number;
    title: string;
    img: string;
    desc: string;
    release_yr: number;
    director: string;
    length: number; // in minutes
    producer: string;
    rating: number; // e.g., 4.75
    genres: string[]; // array of genres
    user: string; // name of the user
    rr: { rr_id: number; user_id: number; user: string; review: string; rating: number }[]; // array of reviews
}