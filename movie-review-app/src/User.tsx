import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { Link } from "react-router";
import MovieForm from "./MovieForm";

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

  // Define the type for a genre item
interface Genre {
    genre_id: number;
    genre: string;
  }

const User = () => {
    const content = useContext(UserContext);
    const [refresh, setRefresh] = useState(0);
      const [data, setData] = useState<Movie[]>([]);
      const [genres, setGenres] = useState<Genre[]>([]);
      useEffect(() => {
        fetch('http://localhost:3000/moviesFromUser/' + content?.user?.user_id)
          .then((res) => res.json())
          .then((data: Movie[]) => setData(data))

        fetch('http://localhost:3000/genres')
          .then((res) => res.json())
          .then((data: Genre[]) => setGenres(data))
      }, [refresh]);
      // console.log();
    function showModal() {
        document.getElementById('my_modal_1')?.classList.add('modal-open');
    }
    return (
        <div className="bg-slate-700 text-white py-10">
            <h4 className="text-2xl text-center mb-6">User Information</h4>
            <p className="text-center"><span className='font-bold me-1'>User Name</span> <span className="text-blue-300">{content?.user?.name}</span></p>
            <p className="text-center"><span className='font-bold me-1'>User Email</span> <span className="text-blue-300">{content?.user?.email}</span></p>
            <h4 className="text-2xl text-center my-6">Your Movies</h4>
            <p className="text-center mb-6"><button type="button" className="btn" onClick={showModal}>Insert a new Movie</button></p>
            <div className='grid grid-cols-4 gap-6 w-9-10 mx-auto'>
        {data.map((x) => (
          <div key={x.movie_id} className="card bg-slate-800 shadow-xl">
            <figure>
              <img className='w-full' src={x.img} alt="poster" />
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
<dialog id="my_modal_1" className="modal text-black">
  <div className="modal-box">
  <section className="hidden text-center">
  <p className="py-4">Successfully inserted a new movie!</p>
  <button type="button" className="btn" onClick={() => {
    document.getElementById('my_modal_1')?.classList.remove('modal-open');
    document.getElementsByTagName('section')[0].classList.add('hidden');
        document.getElementsByTagName('section')[1].classList.remove('hidden');

  }}>Close</button>
  </section>
    <section className="">
      <MovieForm predefinedGenres={genres} setRefresh={setRefresh} />
    </section>

  </div>
</dialog>
      </div>
        </div>
    );
};

export default User;