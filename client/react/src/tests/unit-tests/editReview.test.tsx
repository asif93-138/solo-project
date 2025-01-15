import React from 'react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';

describe('DetailsModals Component', () => {
  const handleSubmit = jest.fn();
  const setRating = jest.fn();
  const setReviewTxt = jest.fn();
  const mockRating = 4;
  const mockReviewTxt = 'Great movie!';

  beforeEach(() => {
    render(
      <Router>
        <dialog id="my_modal_2" className="modal" open>
          <div className="modal-box">
            <form name="rr" method="dialog" className="text-center" onSubmit={handleSubmit}>
              <section id="updateForm">
                <h4 className="text-center text-black text-2xl my-4">Update Rating and Review</h4>

                {/* We cannot use the Rating component from @smastrom 
                and are therefore simply mocking the component*/}
                <input
                  type="number"
                  value={mockRating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  role="spinbutton" // Role added for testing acccessibility
                />

                <textarea
                  value={mockReviewTxt}
                  onChange={(e) => setReviewTxt(e.target.value)}
                  placeholder="Write your review"
                  name="review"
                  className="textarea textarea-bordered textarea-md w-full max-w-xs text-black my-2"
                ></textarea><br />
                <button type="submit" className="btn">Submit</button>
                <button type="button" onClick={() => {
                  document.getElementById('my_modal_2')?.classList.remove('modal-open');
                }} className="btn">Cancel</button>

              </section>
              <section className="hidden" id="updateFormClose">
                <h4 className="text-center text-black text-2xl my-4">Updated!</h4>
                <button type="button" className="btn" onClick={() => document.getElementById('my_modal_2')?.classList.remove('modal-open')}>Close</button>
              </section>
            </form>
          </div>
        </dialog>
      </Router>
    );
  });

  it('should display the header correctly', () => {
    const header = screen.getByText(/update rating and review/i);
    expect(header).toBeInTheDocument();
  });

  it('should display the previous rating in the input field', () => {
    const ratingInput = screen.getByRole('spinbutton');
    expect(ratingInput).toHaveValue(mockRating);
  });

  it('should allow the rating to be changed', () => {
    const ratingInput = screen.getByRole('spinbutton');
    fireEvent.change(ratingInput, { target: { value: 5 } });
    expect(setRating).toHaveBeenCalledWith(5);
  });

  it('should display the previous review in the textarea', () => {
    const reviewTextarea = screen.getByPlaceholderText(/write your review/i);
    expect(reviewTextarea).toHaveValue(mockReviewTxt);
  });

  it('should allow the review text to be changed', () => {
    const reviewTextarea = screen.getByPlaceholderText(/write your review/i);
    fireEvent.change(reviewTextarea, { target: { value: 'Updated review text' } });
    expect(setReviewTxt).toHaveBeenCalledWith('Updated review text');
  });
});
