import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent  implements OnChanges {
  
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

  ratingOpacity = "mask mask-star-2 bg-orange-400";

  ratingHandler(id: any) {
    this.rating = id;
    // console.log(id);
    document.getElementById('star-' + id)?.setAttribute('checked', 'checked');
    // this.ratingOpacity = "mask mask-star-2 bg-orange-400";
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['rating']) {
      // console.log('Updated rating from parent:', this.rating);
      document.getElementById('star-' + this.rating)?.setAttribute('checked', 'checked');
    }
  }
}