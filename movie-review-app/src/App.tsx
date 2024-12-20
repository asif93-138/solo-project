import { useEffect, useState } from 'react';
import './App.css';
import { Link } from 'react-router';

// Define the type for a movie item
interface Movie {
  movie_id: number;
  user_id: number;
  title: string;
  img: string;
  desc: string;
  release_yr: number;
  director: string;
  length: number;
  producer: string;
  averageRating: number;
  genres: { genre: string }[];
}

function App() {
  // Use the defined type for the state
  const [data, setData] = useState<Movie[]>([]);
  const [initialResults, setInitialResults] = useState<Movie[]>([]);
  useEffect(() => {
    fetch('http://localhost:3000/movies')
      .then((res) => res.json())
      .then((data: Movie[]) => {
        setInitialResults(data);
        setData(data);
      }) // Ensure the fetched data matches the Movie type
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  function searchTitle(event: any) {
    if (event.key === "Enter") {
      
      if (event.target.value.trim().length) {
        // console.log(event.target.value.trim());
      fetch('http://localhost:3000/search?title=' + event.target.value.trim())
      .then((res) => res.json())
      .then((data: Movie[]) => {
        if (Array.isArray(data)) {
          setData(data);
        } else {
          setData([]);
        }
      }) // Ensure the fetched data matches the Movie type
      .catch((err) => console.error("Error fetching data:", err));
      document.getElementById('sh')?.classList.remove('hidden');
      } else {
        setData(initialResults);
        document.getElementById('sh')?.classList.add('hidden');
      }
    }
  }
  // console.log(data);
  return (
    <section className="bg-black py-10">
      <label className="input input-bordered flex items-center gap-2 w-1/2 mx-auto mb-10">
  <input type="search" name='search' onKeyDown={searchTitle} className="grow" placeholder="Search by movie title..." />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      fillRule="evenodd"
      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      clipRule="evenodd" />
  </svg>
</label>
<h4 id='sh' className='text-white text-2xl text-center mb-6 hidden'>Search Results!</h4>
      <div className='grid grid-cols-4 gap-6 w-9-10 mx-auto'>
        {data.map((x) => (
          <div key={x.movie_id} className="card bg-slate-800 shadow-xl">
            <figure>
              <img className='w-full' src={'http://localhost:3000' + x.img} alt="poster" />
            </figure>
            <div className="p-6">
              <p>
                <svg className='inline mb-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="15">
                  <path fill="#f5c518" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                </svg>
                <span className='text-slate-300'> {x.averageRating || 0}</span>
              </p>
              <h2 className="card-title block text-white">{x.title}</h2>
              <small className='text-white'>Genre : {x.genres.map((y, index) => (
                <span key={y.genre}>
                  {y.genre}
                  {index < x.genres.length - 1 && ", "}
                </span>
              ))}</small>
              <div className="card-actions mt-4 justify-center">
                <Link to={`/details/${x.movie_id}`}><button type='button' className="btn px-5 py-2 btn-cstm bg-slate-700 text-blue-400 text-base">Details</button></Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default App;