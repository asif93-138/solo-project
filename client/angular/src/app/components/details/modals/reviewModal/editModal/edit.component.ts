import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  @Input() reviewTxt: string = ''; // Input from parent (review text)
  @Input() rating: number = 0;     // Input from parent (rating)
  @Input() showModal: boolean = false; // Input to control modal visibility

  @Output() submitReview = new EventEmitter<{ reviewTxt: string, rating: number }>(); // Event emitter for form submission
  @Output() closeModalEvent = new EventEmitter<void>(); // Event emitter for closing modal

  // Close the modal
  closeModal() {
    this.closeModalEvent.emit(); // Notify the parent to close the modal
  }

  // Handle the form submission
  onSubmit() {
    console.log("Review Text:", this.reviewTxt);
    console.log("Rating:", this.rating);
    const reviewData = {
      reviewTxt: this.reviewTxt,  // Emit the updated review text
      rating: this.rating,     // Emit the updated rating
    };

    this.submitReview.emit(reviewData);  // Emit both the review text and rating
  }

  setRating(event: any) {
    this.rating = event; // Update the rating based on the event
  }
}
