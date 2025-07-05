import "../index.css";
import { useEffect, useState, useContext, FormEvent } from "react";
import { UserContext } from "../contexts/UserContext";
import { Movie, Genre } from "../interfaces/home";
import MovieCards from "../components/MovieCards";
import { getAllGenres } from "../services/genreService";
import { getAllMovies, searchMovies } from "../services/movieService";

function App() {
  const [data, setData] = useState<Movie[]>([]);
  const [initialResults, setInitialResults] = useState<Movie[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [showNRF, setShowNRF] = useState(false);
  const [showSH, setShowSH] = useState(false);
  const [showSCB, setShowSCB] = useState(false);
  const context = useContext(UserContext);
  async function fetchingMovies() {
    const results = await getAllMovies();
    setInitialResults(results);
    setData(results);
  }
  async function fetchingGenres() {
    const results = await getAllGenres();
    setGenres(results);
  }
  useEffect(() => {
    fetchingMovies();
    fetchingGenres();
  }, [context?.homeRefresh]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(searchTitle.trim(), searchGenre);
    if (!searchTitle.trim() && !searchGenre) {return;}
    try {
      const searchData: Movie[] = await searchMovies(
        searchTitle.trim(),
        searchGenre
      );
      if (Array.isArray(searchData)) {
        setData(searchData);
        setShowNRF(false);
      } else {
        setData([]);
        setShowNRF(true);
      }
      setShowSH(true);
      setShowSCB(true);
    } catch (err) {
      console.error("Error fetching data:", err);
      setData([]);
    }
  };

  return (
    <section className="bg-black pt-5 pb-10 min-h-screen">
      <div className="mb-10 flex w-3/5 mx-auto justify-start gap-6 items-end">
        <form
          onSubmit={handleSearch}
          className="flex gap-6 items-end rounded-lg w-9-10"
        >
          <div className="w-1/2">
            <label htmlFor="title" className="label">
              <span className="label-text text-white">Movie Title</span>
            </label>
            <input
              type="text"
              id="title"
              placeholder="Search by title..."
              className="input input-bordered w-full"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="genre" className="label">
              <span className="label-text text-white">Genre</span>
            </label>
            <select
              id="genre"
              className="select select-bordered w-full"
              value={searchGenre}
              onChange={(e) => setSearchGenre(e.target.value)}
            >
              <option value="" disabled>
                All Genres
              </option>
              {genres.map((g) => (
                <option key={g.genre_id} value={g.genre}>
                  {g.genre}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn">
            Search
          </button>
        </form>
        <button
          id="scb"
          type="button"
          className={showSCB ? "btn" : "btn hidden"}
          onClick={() => {
            setSearchTitle("");
            setSearchGenre("");
            setData(initialResults);
            setShowSH(false);
            setShowNRF(false);
            setShowSCB(false);
          }}
        >
          Return
        </button>
      </div>

      <h4
        id="sh"
        className={
          showSH
            ? "text-white text-2xl text-center mb-6"
            : "text-white text-2xl text-center mb-6 hidden"
        }
      >
        Search Results!
      </h4>
      <p
        id="nrf"
        className={
          showNRF ? "text-white text-center" : "text-white text-center hidden"
        }
      >
        No results found..
      </p>
      {data.length > 0 && <MovieCards dataObj={data} />}
    </section>
  );
}

export default App;
