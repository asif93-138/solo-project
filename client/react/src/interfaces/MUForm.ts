export interface MovieData {
  movie_id?: number;
  title?: string;
  img?: string;
  desc?: string;
  release_yr?: number;
  director?: string;
  length?: number;
  producer?: string;
}

export interface MUFormProps {
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
  dataObj: MovieData;
  setShowModal_4A1: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal_4A2: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal_4: React.Dispatch<React.SetStateAction<boolean>>;
}