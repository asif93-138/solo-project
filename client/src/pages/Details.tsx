/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Rating } from '@smastrom/react-rating';
import { UserContext } from "../contexts/UserContext";
import { Movie } from "../interfaces/details";
import DetailsModals from "../components/DetailsModals";
import { getMovieDetails } from "../services/movieService";
import { createRatingAndReview, updateRatingAndReview } from "../services/reviewService";

const Details = () => {
  const context = useContext(UserContext);
  const location = useLocation();
  const [dataObj, setDataObj] = useState<Movie | null>(null);
  const [rating, setRating] = useState(0);
  const [rr_id, setRr_id] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModal_1, setShowModal_1] = useState(false);
  const [showModal_4, setShowModal_4] = useState(false);
  const [showModal_4A1, setShowModal_4A1] = useState(true);
  const [showModal_4A2, setShowModal_4A2] = useState(false);
  const [showModal_5, setShowModal_5] = useState(false);
  const [showModal_2, setShowModal_2] = useState(false);
  const [showUFC, setShowUFC] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [reviewTxt, setReviewTxt] = useState('');

  useEffect(() => {
    getMovieDetails(location.pathname.slice(9), setDataObj);
  }, [refresh])

  async function handleSubmit(event: {
    target: any; preventDefault: () => void;
  }) {
    event.preventDefault();
    const checkerValue = dataObj?.rr.find(x => x.user_id == context?.user?.user_id);
    if (checkerValue) {
      const response = await updateRatingAndReview(checkerValue.rr_id, { rating: rating, review: event.target.review.value });
      if (response.rr_id) {
        setRating(0); event.target.review.value = '';
        setRefresh(refresh + 1);
        setShowModal_2(false);
        setShowUFC(true);
        setTimeout(() => {
          setShowUFC(false);
        }, 1500);
      }
    } else {
      const response = await createRatingAndReview({ movie_id: dataObj?.movie_id, user_id: context?.user?.user_id, rating: rating, review: event.target.review.value });
      if (response.rr_id) {
        setRating(0); event.target.review.value = '';
        setShowModal_1(true);
        setRefresh(refresh + 1);
        setTimeout(() => {
          setShowModal_1(false);
        }, 1500);
      }
    }
  }
  function handleUpdate() {
    setShowModal_4(true);
  }
  return (
    <section className="bg-black text-white py-10">
      <div className="flex justify-around items-center">
        <div className="w-2/5">
          <h2 className="text-5xl mb-4">{dataObj?.title}</h2>
          {dataObj?.genres.map((y) => (
            <small key={y} className="mr-2 border px-2 p-1 text-blue-300 border-blue-300 rounded-3xl">
              {y}
            </small>
          ))}
          <p className="text-slate-200 mt-3">{dataObj?.release_yr} . {dataObj?.length}min</p>
          <p className="mb-8">
            <svg className='inline mb-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="15">
              <path fill="#f5c518" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
            </svg>
            <span className='text-slate-300'> {dataObj?.rating || 0}</span>
          </p>
          <p className="text-lg my-1"><span className='font-bold me-1'>Director</span> <span className="text-blue-300">{dataObj?.director}</span></p>
          <p className="text-lg my-1"><span className='font-bold me-1'>Producer</span> <span className="text-blue-300">{dataObj?.producer}</span></p>
          <p className="text-lg mb-6"><span className='font-bold me-1'>Added By</span> <span className="text-blue-300">{dataObj?.user}</span></p>
          <p className="mb-6">{dataObj?.desc}</p>
          {dataObj?.user_id == context?.user?.user_id && <span><button onClick={handleUpdate} className="btn bg-transparent btn-nav-l text-white min-h-0 h-auto py-3 rounded-full" type="button"><i className="fa-regular fa-pen-to-square"></i> Edit</button> &nbsp; <button onClick={() => setShowModal_5(true)} className="btn btn-d-del btn-error text-white min-h-0 h-auto py-3 rounded-full" type="button"><i className="fa-solid fa-trash"></i> Delete</button></span>}


        </div>
        <img src={'http://localhost:3000' + dataObj?.img} alt="poster" className="poster-img-1 rounded-xl" />
      </div>
      <div className="bg-slate-900 mt-20 px-4 py-10 rounded-3xl mx-28">
        <h3 className="text-3xl text-center">User Reviews</h3>
        {context?.user && !dataObj?.rr.find(x => x.user_id == context?.user?.user_id) && <>
          <h4 className="text-2xl my-3 ml-32">Rate and Review</h4>
          <form name="rr" className="mb-10" onSubmit={handleSubmit}>
            <Rating
              style={{ maxWidth: 180, marginLeft: '120px' }}
              value={rating}
              onChange={setRating} />
            <textarea
              placeholder="Write your review" name="review"
              className="textarea textarea-bordered textarea-md w-4/5 ml-32 bg-slate-700 text-white mt-4 my-2"></textarea><br />
            <button type="submit" className="btn bg-transparent btn-nav-l text-white min-h-0 h-auto py-3 rounded-full ml-32">Submit</button>
          </form>
        </>}
        {dataObj?.rr.map(x => (<article key={x.rr_id} className="w-3/4 mx-auto justify-between bg-slate-700 text-white my-6 p-8 rounded-md">
          <div className="flex justify-between mb-1">
            <p><b>{x.user}</b></p>
            <article className="flex justify-end">
              <svg className='inline' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="15">
                <path fill="#f5c518" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
              </svg>
              <span className='ml-1'> {x?.rating || 0}</span>
            </article>
          </div>
          <p className="text-justify mb-3">{x.review}</p>
          {x.user_id == context?.user?.user_id && <div className="flex justify-end"><button onClick={() => {
            setRating(x?.rating);
            setReviewTxt(x.review);
            setShowModal_2(true);
          }} type="button" className="btn bg-transparent btn-nav-l text-white min-h-0 h-auto p-1 px-2 me-2"><i className="fa-regular fa-pen-to-square"></i></button>
            <button type="button" className="btn bg-transparent btn-nav-l text-white min-h-0 h-auto p-1 px-2"
              onClick={() => { setRr_id(x.rr_id); setShowModal(true); }}
            ><i className="fa-solid fa-trash"></i></button>
          </div>}
        </article>))}
      </div>
      <DetailsModals
        handleSubmit={handleSubmit} reviewTxt={reviewTxt}
        rating={rating} setRating={setRating} setReviewTxt={setReviewTxt} dataObj={dataObj}
        setRefresh={setRefresh} rr_id={rr_id} showModal={showModal} setShowModal={setShowModal}
        showUFC={showUFC} showModal_1={showModal_1}
        showModal_4={showModal_4} setShowModal_4={setShowModal_4}
        showModal_5={showModal_5} setShowModal_5={setShowModal_5} showModal_2={showModal_2}
        setShowModal_2={setShowModal_2} showModal_4A1={showModal_4A1} showModal_4A2={showModal_4A2}
        setShowModal_4A1={setShowModal_4A1} setShowModal_4A2={setShowModal_4A2}
      />
    </section>

  );
};

export default Details;