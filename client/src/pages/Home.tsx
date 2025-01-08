import { useEffect, useState, useContext } from 'react';
import { UserContext } from "../contexts/UserContext";
import '../index.css';
import { Movie, Genre } from '../interfaces/home';
import MovieCards from '../components/MovieCards';
import { getAllGenres, getAllMovies, searchMovies } from '../services/movieService';

function App() {
  const [data, setData] = useState<Movie[]>([]);
  const [initialResults, setInitialResults] = useState<Movie[]>([]);
  const [searchType, setSearchType] = useState<'title' | 'genre'>('title');
  const [searchValue, setSearchValue] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
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

  const handleSearch = async () => {
    if (searchValue.trim().length) {
      if (searchType == 'title') {
        try {
          const searchData: Movie[] = await searchMovies(searchType, searchValue.trim());
          if (Array.isArray(searchData)) {
            setData(searchData);
            document.getElementById('nrf')?.classList.add('hidden');
          } else {
            setData([]);
            document.getElementById('nrf')?.classList.remove('hidden');
          }
          document.getElementById('sh')?.classList.remove('hidden');
          document.getElementById('scb')?.classList.remove('hidden');
        } catch (err) {
          console.error("Error fetching data:", err);
          setData([]);
        }
      } else if (searchType == 'genre') {
        try {
          const searchData: Movie[] = await searchMovies(searchType, searchValue.trim());
          if (Array.isArray(searchData)) {
            setData(searchData);
            document.getElementById('nrf')?.classList.add('hidden');
          } else {
            setData([]);
            document.getElementById('nrf')?.classList.remove('hidden');
          }
          document.getElementById('sh')?.classList.remove('hidden');
          document.getElementById('scb')?.classList.remove('hidden');
        } catch (err) {
          console.error("Error fetching data:", err);
          setData([]);
        }
      }
    } else {
      setData(initialResults);
      document.getElementById('sh')?.classList.add('hidden');
      document.getElementById('nrf')?.classList.add('hidden');
      document.getElementById('scb')?.classList.add('hidden');
    }
  };

  useEffect(() => {
    if (searchType === 'genre') {
      handleSearch();
    }
  }, [searchValue, searchType]);
  return (
    <section className="bg-black py-10 min-h-screen">
      <div className="items-center mb-10 flex w-3/4 mx-auto justify-center">
        <details id='details-tag' className="dropdown">
          <summary className="btn rounded-e-none w-24">{searchType === 'title' ? 'Title' : 'Genre'} <i className="fa-solid fa-chevron-down"></i></summary>
          <ul className="mt-1 menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li><button type='button' className='' onClick={() => {
              document.getElementById("details-tag")?.removeAttribute("open"); setSearchType('title'); setSearchValue('');
            }}>Title</button></li>
            <li><button type='button' className='' onClick={() => {
              document.getElementById("details-tag")?.removeAttribute("open"); setSearchType('genre'); setSearchValue('');
            }}>Genre</button></li>
          </ul>
        </details>
        {searchType === 'title' ? (
          <label className="input input-bordered flex items-center gap-2 w-1/2 rounded-s-none">
            <input type="search" className="grow" placeholder="Search by movie title..." value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
              className="h-4 w-4 opacity-70 cursor-pointer" onClick={handleSearch}>
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd" />
            </svg>
          </label>
        ) : (
          <select
            className="select select-bordered w-1/2 rounded-s-none"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          >
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre.genre_id} value={genre.genre}>{genre.genre}</option>
            ))}
          </select>
        )}
        <button id='scb' type='button' className='btn ms-10 hidden' onClick={() => {
          setSearchValue('');
          setData(initialResults);
          document.getElementById('sh')?.classList.add('hidden');
          document.getElementById('nrf')?.classList.add('hidden');
          document.getElementById('scb')?.classList.add('hidden');
        }}>Return</button>
      </div>

      <h4 id='sh' className='text-white text-2xl text-center mb-6 hidden'>Search Results!</h4>
      <p id='nrf' className='text-white text-center hidden'>No results found..</p>
      <MovieCards dataObj={data} />
    </section>
  );
}

export default App;