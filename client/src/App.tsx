import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from "./UserContext";
import './App.css';
import { Movie, Genre } from './interfaces/home';

function App() {
  const [data, setData] = useState<Movie[]>([]);
  const [initialResults, setInitialResults] = useState<Movie[]>([]);
  const [searchType, setSearchType] = useState<'title' | 'genre'>('title');
  const [searchValue, setSearchValue] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const context = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:3000/api/movie')
      .then((res) => res.json())
      .then((data: Movie[]) => {
        setInitialResults(data);
        setData(data);
      })
      .catch((err) => console.error("Error fetching data:", err));
      fetch('http://localhost:3000/api/genre/')
      .then((res) => res.json())
      .then((data: Genre[]) => setGenres(data))
  }, [context?.homeRefresh]);

  const handleSearch = async () => {
    if (searchValue.trim().length) {
      if (searchType == 'title') {
        // console.log('http://localhost:3000/search?title=' + searchValue.trim());
        try {
          const response = await fetch('http://localhost:3000/api/movie/?title=' + searchValue.trim());
          const searchData: Movie[] = await response.json();
          if (Array.isArray(searchData)) {
            setData(searchData);
            document.getElementById('nrf')?.classList.add('hidden');
          } else {
            setData([]);
            document.getElementById('nrf')?.classList.remove('hidden');
          }
          document.getElementById('sh')?.classList.remove('hidden');
        } catch (err) {
          console.error("Error fetching data:", err);
          setData([]);
        }
      } else if (searchType == 'genre') {
        // console.log('http://localhost:3000/search/genre?genre=' + searchValue.trim());
        try {
          const response = await fetch('http://localhost:3000/api/movie/?genre=' + searchValue.trim());
          const searchData: Movie[] = await response.json();
          if (Array.isArray(searchData)) {
            setData(searchData);
            document.getElementById('nrf')?.classList.add('hidden');
          } else {
            setData([]);
            document.getElementById('nrf')?.classList.remove('hidden');
          }
          document.getElementById('sh')?.classList.remove('hidden');
        } catch (err) {
          console.error("Error fetching data:", err);
          setData([]);
        }
      }
    } else {
      setData(initialResults);
      document.getElementById('sh')?.classList.add('hidden');
      document.getElementById('nrf')?.classList.add('hidden');
    }
  };

  useEffect(() => {
    if (searchType === 'genre') {
      handleSearch();
    }
  }, [searchValue, searchType]);
  // console.log(data.length);
  return (
    <section className="bg-black py-10 min-h-screen">
      <div className="items-center mb-10 flex w-3/4 mx-auto justify-center">
      <details className="dropdown">
  <summary className="btn rounded-e-none">{searchType === 'title' ? 'Title' : 'Genre'} <i className="fa-solid fa-chevron-down"></i></summary>
  <ul className="mt-1 menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
    <li><button type='button' className='' onClick={() => {
      document.getElementsByTagName("details")[1].removeAttribute("open"); setSearchType('title'); setSearchValue('');
    }}>Title</button></li>
    <li><button type='button' className='' onClick={() => {
      document.getElementsByTagName("details")[1].removeAttribute("open"); setSearchType('genre'); setSearchValue('');
    }}>Genre</button></li>
  </ul>
</details>
        {searchType === 'title' ? (
          <label className="input input-bordered flex items-center gap-2 w-1/2 rounded-s-none">
            <input 
              type="search" 
              className="grow" 
              placeholder="Search by movie title..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70 cursor-pointer"
              onClick={handleSearch}
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
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
        
      </div>

      <h4 id='sh' className='text-white text-2xl text-center mb-6 hidden'><span>Search Results!</span>
      <button type='button' className='btn ms-10 h-auto min-h-0 py-2' onClick={() => {
        setSearchValue('');
        setData(initialResults);
        document.getElementById('sh')?.classList.add('hidden');
        document.getElementById('nrf')?.classList.add('hidden');
      }}>close</button></h4>
      <p id='nrf' className='text-white text-center hidden'>No results found..</p>
      <div className='grid grid-cols-4 gap-12 w-9-10 mx-auto'>
        {data.map((x) => (
          <Link to={`/details/${x.movie_id}`} key={x.movie_id}>
            <div className="card shadow-xl relative">
            <figure className='rounded-3xl'>
              <img className='poster-img' src={'http://localhost:3000' + x.img} alt="poster" />
            </figure>
            <div className="absolute bottom-0 w-full pb-1 p-2" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
            <h2 title={x.title} className="card-title block text-white">{x.title.length > 22 ? x.title.slice(0, 22) + '...' : x.title}</h2>
            <article className='flex justify-between'>
              <p className='text-slate-300'>{x.release_yr}</p>
            <p>
                <svg className='inline mb-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="15">
                  <path fill="#f5c518" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                </svg>
                <span className='text-slate-300'> {x.averageRating || 0}</span>
              </p>
            </article>

              <div className="card-actions mt-4 justify-center">
                
              </div>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default App;