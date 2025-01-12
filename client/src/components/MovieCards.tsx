import React from "react";
import { Link } from "react-router";
import { MovieCardsProps } from "../interfaces/home";

const MovieCards: React.FC<MovieCardsProps> = ({ dataObj }) => {
  return (
    <div className='grid grid-cols-4 gap-12 w-9-10 mx-auto'>
      {dataObj.map((x) => (
        <Link to={`/details/${x.movie_id}`} key={x.movie_id}>
          <div className="card shadow-xl relative">
          <img className='poster-img rounded-3xl' src={'http://localhost:3000' + x.img} alt="poster" />
            {/* <figure className=''>
              
            </figure> */}
            <div className="absolute bottom-0 w-full pb-1 p-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
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
  );
};

export default MovieCards;