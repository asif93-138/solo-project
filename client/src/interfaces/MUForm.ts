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
}