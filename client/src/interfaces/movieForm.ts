export interface MovieData {
  title: string;
  img: string;
  desc: string;
  release_yr: number | string;
  director: string;
  length: number | string;
  producer: string;
  genre: string[];
}

export interface MovieFormProps {
    setHomeRefresh: React.Dispatch<React.SetStateAction<number>>;
    setListRefresh: React.Dispatch<React.SetStateAction<number>>;
    setShowFirstModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowSecondModal: React.Dispatch<React.SetStateAction<boolean>>;
  }