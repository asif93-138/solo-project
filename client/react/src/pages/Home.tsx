import "../index.css";
import { useEffect, useState, useContext, FormEvent, useCallback } from "react";
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
  const [stopLoading, setStopLoading] = useState(false);
  const context = useContext(UserContext);
  const [pageNumber, setPageNumber] = useState(1);

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  async function fetchingMovies(start: number, end: number) {
    const results = await getAllMovies(start, end);
    setInitialResults(results);
    setData(results);
  }
  async function fetchingGenres() {
    const results = await getAllGenres();
    setGenres(results);
  }

  async function initialDataLoader() {
    setIsLoading(true);
    await fetchingMovies((pageNumber * 50 - 49), (pageNumber * 50));
    await fetchingGenres();
    setIsLoading(false);
  }

  async function scrollLoading() {
    setIsLoading(true);
    const results = await getAllMovies((pageNumber * 50 - 49), (pageNumber * 50));
    if (results.length < 50) setStopLoading(true);
    setInitialResults([...initialResults, ...results]);
    setData([...initialResults, ...results]);
    setIsLoading(false);
  }

  useEffect(() => {
    initialDataLoader();
    setPageNumber(1);
  }, [context?.homeRefresh]);

  useEffect(() => {
    scrollLoading();
  }, [pageNumber]);

  // Load more data function
  const loadMoreData = useCallback(() => {
    if (isLoading || stopLoading || showSH) return
    setPageNumber(pageNumber + 1);
  }, [isLoading, stopLoading, showSH]) // currentPage, allCards, 

    // Scroll event handler
  const handleScroll = useCallback(() => {
    if (isLoading) return

    // Check if user scrolled to bottom
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // Trigger load more when user is 100px from bottom
    if (scrollTop + windowHeight >= documentHeight - 100) {
      loadMoreData();
    }
  }, [loadMoreData, isLoading])

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(searchTitle.trim(), searchGenre);
    if (!searchTitle.trim() && !searchGenre) {return;}
    try {
      setData([]); setIsLoading(true);
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
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setData([]); setIsLoading(false);
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
                Select genre
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
      {isLoading && <p className="text-center mt-20"><span className="loading loading-spinner text-white w-20"></span></p>}
    </section>
  );
}

export default App;
