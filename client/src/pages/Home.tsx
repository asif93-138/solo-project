import '../index.css';
import { useEffect, useState, useContext, FormEvent } from 'react';
import { UserContext } from "../contexts/UserContext";
import { Movie, Genre } from '../interfaces/home';
import MovieCards from '../components/MovieCards';
import { getAllGenres } from '../services/genreService';
import { getAllMovies, searchMovies } from '../services/movieService';

function App() {
  const [data, setData] = useState<Movie[]>([]);
  const [initialResults, setInitialResults] = useState<Movie[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
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
          try {
          const searchData: Movie[] = await searchMovies(searchTitle.trim(), searchGenre);
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

      // if (searchType == 'title') {
      //   try {
      //     const searchData: Movie[] = await searchMovies(searchType, searchValue.trim());
      //     if (Array.isArray(searchData)) {
      //       setData(searchData);
      //       setShowNRF(false);
      //     } else {
      //       setData([]);
      //       setShowNRF(true);
      //     }
      //     setShowSH(true);
      //     setShowSCB(true);
      //   } catch (err) {
      //     console.error("Error fetching data:", err);
      //     setData([]);
      //   }
      // } else if (searchType == 'genre') {
      //   try {
      //     const searchData: Movie[] = await searchMovies(searchType, searchValue.trim());
      //     if (Array.isArray(searchData)) {
      //       setData(searchData);
      //       setShowNRF(false);
      //     } else {
      //       setData([]);
      //       setShowNRF(true);
      //     }
      //     setShowSH(true);
      //     setShowSCB(true);
      //   } catch (err) {
      //     console.error("Error fetching data:", err);
      //     setData([]);
      //   }
      // }
  };

  return (
    <section className="bg-black py-10 min-h-screen">
      <div className="items-center mb-10 flex w-3/4 mx-auto justify-center">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 p-4 bg-base-200 rounded-lg shadow-md">
      <div className="form-control flex-grow">
        <label htmlFor="title" className="label">
          <span className="label-text">Movie Title</span>
        </label>
        <input
          type="text"
          id="title"
          placeholder="Search by title..."
          className="input input-bordered w-full"
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
        />
      </div>
      <div className="form-control flex-grow">
        <label htmlFor="genre" className="label">
          <span className="label-text">Genre</span>
        </label>
        <select
          id="genre"
          className="select select-bordered w-full"
          value={searchGenre}
          onChange={e => setSearchGenre(e.target.value)}
        >
          <option value="" disabled>All Genres</option>
          {genres.map((g) => (
            <option key={g.genre_id} value={g.genre}>
              {g.genre}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control sm:self-end">
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </div>
    </form>
        <button id='scb' type='button' className={showSCB ? 'btn ms-10' : 'btn ms-10 hidden'} onClick={() => {
          setSearchTitle('');
          setSearchGenre('');
          setData(initialResults);
          setShowSH(false);
          setShowNRF(false);
          setShowSCB(false);
        }}>Return</button>
      </div>

      <h4 id='sh' className={showSH ? 'text-white text-2xl text-center mb-6' : 'text-white text-2xl text-center mb-6 hidden'}>Search Results!</h4>
      <p id='nrf' className={showNRF ? 'text-white text-center' : 'text-white text-center hidden'}>No results found..</p>
      {data.length > 0 && <MovieCards dataObj={data} />}
    </section>
  );
}

export default App;