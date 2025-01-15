import "../index.css";
import { Movie, Genre } from "../interfaces/home";
import MovieCards from "../components/MovieCards";
import { UserContext } from "../contexts/UserContext";
import { getAllGenres } from "../services/genreService";
import { useEffect, useState, useContext, FormEvent } from "react";
import { getAllMovies, searchMovies } from "../services/movieService";

function App() {
  const context = useContext(UserContext);
  const [showSH, setShowSH] = useState(false);
  const [data, setData] = useState<Movie[]>([]);
  const [showSCB, setShowSCB] = useState(false);
  const [showNRF, setShowNRF] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [initialResults, setInitialResults] = useState<Movie[]>([]);

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
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn hidden"
        onClick={() =>
          document.getElementById("my_modal_x")?.classList.add("modal-open")
        }
      >
        open modal
      </button>
      <dialog id="my_modal_x" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn"
                onClick={() =>
                  document
                    .getElementById("my_modal_x")
                    ?.classList.remove("modal-open")
                }
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="items-end mb-10 flex w-3/4 mx-auto justify-center">
        <form onSubmit={handleSearch} className="flex gap-4 rounded-lg">
          <div className="">
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
          <div className="">
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
          <div className="form-control sm:self-end">
            <button type="submit" className="btn">
              Search
            </button>
          </div>
        </form>
        <button
          id="scb"
          type="button"
          className={showSCB ? "btn ms-10" : "btn ms-10 hidden"}
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
