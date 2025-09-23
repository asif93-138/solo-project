import { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router";
import { Movie, Genre } from "../interfaces/home";
import { getMyList } from "../services/movieService";
import { getAllGenres } from "../services/genreService";

const Mylist = () => {
  const context = useContext(UserContext);
  const [data, setData] = useState<Movie[]>([]); 
  const [initialResults, setInitialResults] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]); 
  const [searchTitle, setSearchTitle] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [showNRF, setShowNRF] = useState(false);
  const [showSH, setShowSH] = useState(false);
  const [showSCB, setShowSCB] = useState(false);
  const [stopLoading, setStopLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false)

      // debounce
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout
    return (...args: any[]) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => func(...args), delay)
    }
  }

    // Load more data function
    const loadMoreData = useCallback(() => {
      if (isLoading || stopLoading || showSH || !context?.user) return
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

  async function fetchingGenres() {
    const results = await getAllGenres();
    setGenres(results);
  }
    async function fetchingMovies() {
      setIsLoading(true);
      const data = await getMyList(context?.user?.user_id, (pageNumber * 50 - 49), (pageNumber * 50));
      setInitialResults(data); setData(data);
      setIsLoading(false);
  }

    async function scrollLoading() {
      setIsLoading(true);
      const results = await getMyList(context?.user?.user_id, (pageNumber * 50 - 49), (pageNumber * 50));
      if (!Array.isArray(results)) {setStopLoading(true); return;}
      if (results.length < 50) setStopLoading(true);
      setInitialResults([...initialResults, ...results]);
      setData([...initialResults, ...results]);
      setIsLoading(false);
    }  
  useEffect(() => {
    if (context?.user) scrollLoading();
  }, [pageNumber]);
  useEffect(() => {
    if (context?.user) {
      fetchingMovies();
      fetchingGenres();
      setPageNumber(1);
    }
  }, [context?.listRefresh, context?.user]);
  const handleSearch = async (searchTitle: string, searchGenre: string, user_id: number | undefined) => {
    // console.log(searchTitle.trim(), searchGenre);
    let searchAPI = "http://localhost:3000/api/movie/user/" + user_id;
    if (searchTitle.trim() && searchGenre) {
      searchAPI += "?title=" + searchTitle.trim() + "&genre=" + searchGenre;
    }
    else if (searchTitle.trim()) {
      searchAPI += "?title=" + searchTitle.trim();
    }
    else if (searchGenre) {
      searchAPI += "?genre=" + searchGenre;
    }
    else {return;}
      fetch(searchAPI)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
        setData(data);
        setShowNRF(false);
      } else {
        setData([]);
        setShowNRF(true);
      }
      setShowSH(true);
      setShowSCB(true);
      });
  };
      // memoized debounced function
  const debouncedFetch = useCallback(debounce(handleSearch, 1000), [])
  useEffect(() => {
    handleSearch(searchTitle, searchGenre, context?.user?.user_id);
  }, [searchGenre]);

    useEffect(() => {
    debouncedFetch(searchTitle, searchGenre, context?.user?.user_id);
  }, [searchTitle, debouncedFetch]);
  return (
    <div className="bg-black text-white py-4 min-h-screen">
      {context?.user ? 
        <h4 className="text-2xl txt-outline-c text-center mb-6">Your Movies</h4>
      :
        <h4 className="text-2xl txt-outline-c text-center mt-20">
          Please login/register to see Your Movies!
        </h4>
      }

      {context?.user && <form
          onSubmit={(e) => {e.preventDefault(); handleSearch(searchTitle, searchGenre, context.user?.user_id);}}
          className="mb-6 md:mb-10 md:flex gap-6 items-end rounded-lg  md:w-3/5 w-[90%] mx-auto text-center"
        >
          <div className="md:w-1/2">
            <label htmlFor="title" className="label">
              <span className="label-text text-white">Movie Title</span>
            </label>
            <input
              type="text"
              id="title"
              placeholder="Search by title..."
              className="input input-bordered w-full text-black"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
          <div className="md:w-1/2">
            <label htmlFor="genre" className="label">
              <span className="label-text text-white">Genre</span>
            </label>
            <select
              id="genre"
              className="select select-bordered w-full text-black"
              value={searchGenre}
              onChange={(e) => setSearchGenre(e.target.value)}
            >
              <option value="" disabled>
                Select genre
              </option>
              {genres.map((g) => (
                <option key={g.genre_id} value={g.genre} className="text-gray-700">
                  {g.genre}
                </option>
              ))}
            </select>
          </div>
        <button
          id="scb"
          type="button"
          className={showSCB ? "btn mt-8 md:mt-0" : "btn hidden mt-8 md:mt-0"}
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
        </form>}

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
      <div className="md:grid grid-cols-4 gap-12 w-4/5 md:w-[90%] mx-auto">
        {data.map((x) => (
          <Link to={`/details/${x.movie_id}`} key={x.movie_id}>
            <div className="card shadow-xl my-10 md:my-0">
            <img
                  className="poster-img rounded-3xl"
                  src={"http://localhost:3000" + x.img}
                  alt="poster"
                />
              {/* <figure>

              </figure> */}
              <div className="">
                <h2 className="card-title block text-white">{x.title}</h2>
                <article className="flex justify-between">
                  <p className="text-slate-500">{x.release_yr}</p>
                  <p>
                    <svg
                      className="inline mb-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      width="15"
                    >
                      <path
                        fill="#f5c518"
                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                      />
                    </svg>
                    <span className="text-slate-300">
                      {" "}
                      {x.averageRating ? Number(x.averageRating).toFixed(2) : 0}
                    </span>
                  </p>
                </article>

                <small className="text-white">
                  Genre :{" "}
                  {x.genres.map((y) => (
                    <span
                      key={y}
                      className="mx-1 border px-2 p-1 text-blue-400 border-blue-400 rounded-3xl"
                    >
                      {y}
                    </span>
                  ))}
                </small>
                <div className="card-actions mt-4 justify-center"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {context?.user && isLoading && <p className="text-center mt-20"><span className="loading loading-spinner text-white w-20"></span></p>}
    </div>
  );
};

export default Mylist;