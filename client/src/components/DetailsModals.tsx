import React, { useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import MUForm from './EditMovie';
import { useNavigate } from 'react-router';
import { DetailsModalsProps } from '../interfaces/details';
import { deleteMovie, deleteRatingAndReview } from '../services/movieService';

export const DetailsModals: React.FC<DetailsModalsProps> = ({ handleSubmit, rating, setRating, reviewTxt, setReviewTxt, dataObj, setRefresh, rr_id, showModal, setShowModal, showUF, setShowUF, showUFC, setShowUFC, showModal_1, setShowModal_1, showModal_4, setShowModal_4, showModal_5, setShowModal_5, showModal_2, setShowModal_2, showModal_4A1, showModal_4A2, setShowModal_4A1, setShowModal_4A2 }) => {
  const [showModalP1, setShowModalP1] = useState(true);
  const [showModal_3, setShowModal_3] = useState(false);
  const navigate = useNavigate();
  function closeModal_1() {
    setShowModal_2(false);
    setShowUF(true);
    setShowUFC(false);
  }
  function closeModal_3() {
    setShowModal_3(false);
    navigate('/user');
  }
  async function handleDelete() {
    setShowModal_5(false);
    const response = await deleteMovie(dataObj?.movie_id);
    if (response.deleted) {
      setShowModal_3(true);
    }
  }
  function closeModal() {
    setShowModal_1(false);
  }
  return (
    <>

      <dialog id="my_modal_2" className={showModal_2? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <form name="rr" method="dialog" className="text-center" onSubmit={handleSubmit}>
            <section id="updateForm" className={showUF ? '' : 'hidden'}>
              <h4 className="text-center text-black text-2xl my-4">Update Rating and Review</h4>
              <Rating
                style={{ maxWidth: 180, margin: 'auto' }}
                value={rating}
                onChange={setRating} />
              <textarea value={reviewTxt} onChange={(e) => setReviewTxt(e.target.value)}
                placeholder="Write your review" name="review"
                className="textarea textarea-bordered textarea-md w-full max-w-xs text-black my-2"></textarea><br />
              <button type="submit" className="btn">Submit</button> <button type="button" onClick={() => {
                setShowModal_2(false);
              }} className="btn">Cancel</button>
            </section>
            <section className={showUFC? '' : "hidden"} id="updateFormClose">
              <h4 className="text-center text-black text-2xl my-4">Updated!</h4>
              <button type="button" className="btn" onClick={closeModal_1}>Close</button>
            </section>
          </form>
        </div>
      </dialog>

      <dialog id="my_modal_3" className={showModal_3? "modal modal-open" : "modal"}>
        <div className="modal-box text-center">
          <h4 className="text-red-500 text-2xl my-4">Deleted!</h4>
          <button type="button" className="btn" onClick={closeModal_3}>Close</button>
        </div>
      </dialog>
      <dialog id="my_modal_5" className={showModal_5 ? "modal modal-open" : "modal"}>
        <div className="modal-box text-center">
          <h4 className="text-black text-2xl mb-4">Delete this item?</h4>
          <button type="button" className="btn text-red-500" onClick={handleDelete}>Confirm</button> &nbsp; &nbsp; <button type="button" className="btn" onClick={() => setShowModal_5(false)}>Cancel</button>
        </div>
      </dialog>
      <dialog id="my_modal_4" className={showModal_4? "modal modal-open" : "modal"}>
        <div className="modal-box text-black">
          <article id="my_modal_4A1" className={showModal_4A1? "" : "hidden"}>
            {dataObj && <MUForm setRefresh={setRefresh} dataObj={dataObj} setShowModal_4A1={setShowModal_4A1} setShowModal_4A2={setShowModal_4A2} setShowModal_4={setShowModal_4} />}
          </article>
          <article id="my_modal_4A2" className={showModal_4A2? "text-center" : "hidden text-center"}>
            <h4 className="text-black text-2xl my-4">Updated!</h4>
            <button type="button" className="btn" onClick={() => {
              setShowModal_4(false);
              setShowModal_4A2(false);
              setShowModal_4A1(true);
            }}>Close</button>
          </article>
        </div>
      </dialog>
      <dialog id="my_modal_1" className={showModal_1 ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <p className="py-4 text-black font-medium text-center">Rating and review posted!</p>
          <div className="">
            <form method="dialog" className="text-center">
              <button className="btn" onClick={closeModal}>Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="my_modal_6" className={showModal ? "modal modal-open" : "modal"}>
        <div className="modal-box text-center">
          {showModalP1 ?
            <>
              <h4 className="text-black text-2xl mb-4">Delete your rating and review?</h4>
              <button type="button" className="btn text-red-500" onClick={async () => {
                const response = await deleteRatingAndReview(rr_id);
                if (response.deleted) {
                  setShowModalP1(false);
                }
              }}>Confirm</button> &nbsp; &nbsp; <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
            </>
            :
            <><h4 className="text-black text-2xl mb-4">Deleted!</h4>
              <button type='button' className='btn' onClick={() => {
                setShowModalP1(true); setShowModal(false); setRefresh((prev) => prev + 1);
              }}>Close</button></>}
        </div>
      </dialog>
    </>
  );
};

export default DetailsModals;