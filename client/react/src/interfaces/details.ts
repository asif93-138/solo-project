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

export interface DetailsModalsProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    rating: number;
    setRating: React.Dispatch<React.SetStateAction<number>>;
    reviewTxt: string;
    setReviewTxt: React.Dispatch<React.SetStateAction<string>>;
    dataObj: Movie | null;
    setRefresh: React.Dispatch<React.SetStateAction<number>>;
    rr_id: number;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showUFC: boolean;
    showModal_1: boolean;
    showModal_4: boolean;
    setShowModal_4: React.Dispatch<React.SetStateAction<boolean>>;
    showModal_5: boolean;
    setShowModal_5: React.Dispatch<React.SetStateAction<boolean>>;
    showModal_2: boolean;
    setShowModal_2: React.Dispatch<React.SetStateAction<boolean>>;
    showModal_4A1: boolean;
    showModal_4A2: boolean;
    setShowModal_4A1: React.Dispatch<React.SetStateAction<boolean>>;
    setShowModal_4A2: React.Dispatch<React.SetStateAction<boolean>>;
  }