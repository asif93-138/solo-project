import React, { useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import MUForm from './EditMovie';
import { useNavigate } from 'react-router';
import { DetailsModalsProps } from '../interfaces/details';
import { deleteMovie } from '../services/movieService';
import { deleteRatingAndReview } from '../services/reviewService';

export const DetailsModals: React.FC<DetailsModalsProps> = ({ handleSubmit, rating, setRating, reviewTxt, setReviewTxt, dataObj, setRefresh, rr_id, showModal, setShowModal }) => {
  const [showModalP1, setShowModalP1] = useState(true);
  const navigate = useNavigate();
  function closeModal_1() {
    document.getElementById('my_modal_2')?.classList.remove('modal-open');
    document.getElementById('updateForm')?.classList.remove('hidden');
    document.getElementById('updateFormClose')?.classList.add('hidden');
  }
  function closeModal_3() {
    document.getElementById('my_modal_3')?.classList.remove('modal-open');
    navigate('/user');
  }
  async function handleDelete() {
    document.getElementById('my_modal_5')?.classList.remove('modal-open');
    const response = await deleteMovie(dataObj?.movie_id);
    if (response.deleted) {
      document.getElementById('my_modal_3')?.classList.add('modal-open');
    }
  }
  function closeModal() {
    document.getElementById('my_modal_1')?.classList.remove('modal-open');
  }
  return (
    <>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <form name="rr" method="dialog" className="text-center" onSubmit={handleSubmit}>
            <section id="updateForm">
              <h4 className="text-center text-black text-2xl my-4">Update Rating and Review</h4>
              <Rating
                style={{ maxWidth: 180, margin: 'auto' }}
                value={rating}
                onChange={setRating} />
              <textarea value={reviewTxt} onChange={(e) => setReviewTxt(e.target.value)}
                placeholder="Write your review" name="review"
                className="textarea textarea-bordered textarea-md w-full max-w-xs text-black my-2"></textarea><br />
              <button type="submit" className="btn">Submit</button> <button type="button" onClick={() => {
                document.getElementById('my_modal_2')?.classList.remove('modal-open');
              }} className="btn">Cancel</button>
            </section>
            <section className="hidden" id="updateFormClose">
              <h4 className="text-center text-black text-2xl my-4">Updated!</h4>
              <button type="button" className="btn" onClick={closeModal_1}>Close</button>
            </section>
          </form>
        </div>
      </dialog>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box text-center">
          <h4 className="text-red-500 text-2xl my-4">Deleted!</h4>
          <button type="button" className="btn" onClick={closeModal_3}>Close</button>
        </div>
      </dialog>
      <dialog id="my_modal_5" className="modal">
        <div className="modal-box text-center">
          <h4 className="text-black text-2xl mb-4">Delete this item?</h4>
          <button type="button" className="btn text-red-500" onClick={handleDelete}>Confirm</button> &nbsp; &nbsp; <button type="button" className="btn" onClick={() => document.getElementById('my_modal_5')?.classList.remove('modal-open')}>Cancel</button>
        </div>
      </dialog>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box text-black">
          <article id="my_modal_4A1" className="">
            {dataObj && <MUForm setRefresh={setRefresh} dataObj={dataObj} />}
          </article>
          <article id="my_modal_4A2" className="hidden text-center">
            <h4 className="text-black text-2xl my-4">Updated!</h4>
            <button type="button" className="btn" onClick={() => {
              document.getElementById('my_modal_4')?.classList.remove('modal-open');
              document.getElementById('my_modal_4A2')?.classList.add('hidden');
              document.getElementById('my_modal_4A1')?.classList.remove('hidden');
            }}>Close</button>
          </article>
        </div>
      </dialog>
      <dialog id="my_modal_1" className="modal">
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