import React, { useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import MUForm from './EditMovie';
import { useNavigate } from 'react-router';
import { DetailsModalsProps } from '../interfaces/details';
import { deleteMovie } from '../services/movieService';
import { deleteRatingAndReview } from '../services/reviewService';

export const DetailsModals: React.FC<DetailsModalsProps> = ({ handleSubmit, rating, setRating, reviewTxt, setReviewTxt, dataObj, setRefresh, rr_id, showModal, setShowModal, showUFC, showModal_1, showModal_4, setShowModal_4, showModal_5, setShowModal_5, showModal_2, setShowModal_2, showModal_4A1, showModal_4A2, setShowModal_4A1, setShowModal_4A2 }) => {
  const [showModalP1, setShowModalP1] = useState(true);
  const [showModal_3, setShowModal_3] = useState(false);
  const navigate = useNavigate();
  async function handleDelete() {
    setShowModal_5(false);
    const response = await deleteMovie(dataObj?.movie_id, dataObj?.img.substring(9));
    if (response.deleted) {
      setShowModal_3(true);
      setTimeout(() => {
        setShowModal_3(false);
        navigate('/user');
      }, 1500);
    }
  }

  return (
    <>
      {/* Modal for updating rating and review */}
      <dialog id="my_modal_2" className={showModal_2 ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          <form name="rr" method="dialog" className="text-center" onSubmit={handleSubmit}>
            <section id="updateForm">
              <h4 className="text-center text-black text-2xl my-4">Update Rating and Review</h4>
              {/* Star rating component */}
              <Rating
                style={{ maxWidth: 180, margin: 'auto' }}
                value={rating}
                onChange={setRating} />
              {/* Textarea for review input */}
              <textarea value={reviewTxt} onChange={(e) => setReviewTxt(e.target.value)}
                placeholder="Write your review" name="review"
                className="textarea textarea-bordered textarea-md w-full max-w-xs text-black my-2"></textarea><br />
              {/* Submit and Cancel buttons */}
              <button type="submit" className="btn">Submit</button>
              <button type="button" onClick={() => setShowModal_2(false)} className="btn">Cancel</button>
            </section>
          </form>
        </div>
      </dialog>

      {/* Toast notifications */}
      <div className="toast toast-top toast-center">
        {/* Notification for update confirmation */}
        <div className={showUFC || showModal_4A2 ? "alert alert-warning block" : "alert alert-warning hidden"}>
          <span>Updated!</span>
        </div>
        {/* Notification for deletion */}
        <div className={showModal_3 || !showModalP1 ? "alert alert-error text-white block" : "alert alert-error text-white hidden"}>
          <span>Deleted!</span>
        </div>
        {/* Notification for posting a rating and review */}
        <div className={showModal_1 ? "alert alert-warning block" : "alert alert-warning hidden"}>
          <span>Rating and review posted!</span>
        </div>
      </div>

      {/* Modal for deleting a movie */}
      <dialog id="my_modal_5" className={showModal_5 ? "modal modal-open" : "modal"}>
        <div className="modal-box text-center">
          <h4 className="text-black text-2xl mb-4">Delete this item?</h4>
          {/* Confirm and Cancel buttons */}
          <button type="button" className="btn text-red-500" onClick={handleDelete}>Confirm</button>
          <button type="button" className="btn" onClick={() => setShowModal_5(false)}>Cancel</button>
        </div>
      </dialog>

      {/* Modal for editing movie details */}
      <dialog id="my_modal_4" className={showModal_4 ? "modal modal-open" : "modal"}>
        <div className="modal-box text-black max-w-full w-1/2">
          {/* Section for the movie edit form */}
          <article id="my_modal_4A1" className={showModal_4A1 ? "" : "hidden"}>
            {dataObj && <MUForm setRefresh={setRefresh} dataObj={dataObj} setShowModal_4A1={setShowModal_4A1} setShowModal_4A2={setShowModal_4A2} setShowModal_4={setShowModal_4} />}
          </article>
        </div>
      </dialog>

      {/* Modal for deleting a rating and review */}
      <dialog id="my_modal_6" className={showModal ? "modal modal-open" : "modal"}>
        <div className="modal-box text-center">
          {showModalP1 &&
            <>
              <h4 className="text-black text-2xl mb-4">Delete your rating and review?</h4>
              {/* Confirm and Cancel buttons */}
              <button type="button" className="btn text-red-500" onClick={async () => {
                const response = await deleteRatingAndReview(rr_id);
                if (response.deleted) {
                  setShowModalP1(false); setShowModal(false);
                  setTimeout(() => {
                    setShowModalP1(true); setRefresh((prev) => prev + 1);
                  }, 1500);
                }
              }}>Confirm</button>
              <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
            </>}
        </div>
      </dialog>
    </>
  );
};

// return (
//   <>
//     <dialog id="my_modal_2" className={showModal_2 ? "modal modal-open" : "modal"}>
//       <div className="modal-box">
//         <form name="rr" method="dialog" className="text-center" onSubmit={handleSubmit}>
//           <section id="updateForm">
//             <h4 className="text-center text-black text-2xl my-4">Update Rating and Review</h4>
//             <Rating
//               style={{ maxWidth: 180, margin: 'auto' }}
//               value={rating}
//               onChange={setRating} />
//             <textarea value={reviewTxt} onChange={(e) => setReviewTxt(e.target.value)}
//               placeholder="Write your review" name="review"
//               className="textarea textarea-bordered textarea-md w-full max-w-xs text-black my-2"></textarea><br />
//             <button type="submit" className="btn">Submit</button> <button type="button" onClick={() => {
//               setShowModal_2(false);
//             }} className="btn">Cancel</button>
//           </section>
//         </form>
//       </div>
//     </dialog>
//     <div className="toast toast-top toast-center">
//       <div className={showUFC || showModal_4A2 ? "alert alert-warning block" : "alert alert-warning hidden"}>
//         <span>Updated!</span>
//       </div>
//       <div className={showModal_3 || !showModalP1 ? "alert alert-error text-white block" : "alert alert-error text-white hidden"}>
//         <span>Deleted!</span>
//       </div>
//       <div className={showModal_1 ? "alert alert-warning block" : "alert alert-warning hidden"}>
//         <span>Rating and review posted!</span>
//       </div>
//     </div>
//     <dialog id="my_modal_5" className={showModal_5 ? "modal modal-open" : "modal"}>
//       <div className="modal-box text-center">
//         <h4 className="text-black text-2xl mb-4">Delete this item?</h4>
//         <button type="button" className="btn text-red-500" onClick={handleDelete}>Confirm</button> &nbsp; &nbsp; <button type="button" className="btn" onClick={() => setShowModal_5(false)}>Cancel</button>
//       </div>
//     </dialog>
//     <dialog id="my_modal_4" className={showModal_4 ? "modal modal-open" : "modal"}>
//       <div className="modal-box text-black max-w-full w-1/2">
//         <article id="my_modal_4A1" className={showModal_4A1 ? "" : "hidden"}>
//           {dataObj && <MUForm setRefresh={setRefresh} dataObj={dataObj} setShowModal_4A1={setShowModal_4A1} setShowModal_4A2={setShowModal_4A2} setShowModal_4={setShowModal_4} />}
//         </article>
//       </div>
//     </dialog>
//     <dialog id="my_modal_6" className={showModal ? "modal modal-open" : "modal"}>
//       <div className="modal-box text-center">
//         {showModalP1 &&
//           <>
//             <h4 className="text-black text-2xl mb-4">Delete your rating and review?</h4>
//             <button type="button" className="btn text-red-500" onClick={async () => {
//               const response = await deleteRatingAndReview(rr_id);
//               if (response.deleted) {
//                 setShowModalP1(false); setShowModal(false);
//                 setTimeout(() => {
//                   setShowModalP1(true); setRefresh((prev) => prev + 1);
//                 }, 1500);
//               }
//             }}>Confirm</button> &nbsp; &nbsp; <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
//           </>}
//       </div>
//     </dialog>
//   </>
// );

export default DetailsModals;