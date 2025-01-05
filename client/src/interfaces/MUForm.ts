export interface MovieData {
  movie_id?: number;
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