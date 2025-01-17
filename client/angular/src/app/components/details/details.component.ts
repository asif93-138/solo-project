import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MovieDetails } from 'src/app/interfaces/movie';
import { MovieService } from 'src/app/services/movieServices/movie.service';
import { ReviewService } from 'src/app/services/reviewServices/review.service';
import { DeleteComponent } from "./modals/movieModal/deleteModal/delete/delete.component";
import { ToastersComponent } from './modals/toasters/toasters.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DeleteComponent, ToastersComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit {
  movieDetails: MovieDetails | null = null;
  reviewForm: FormGroup;
  rating = 0;

  // States for the toaster notifications
  showUFC = false;
  showModal1 = false;
  showModal3 = false;

  //Delete Movie Prompt/Modal
  showDeleteModal: boolean = false;
  movieIdToDelete: number | null = null;

  private route: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);
  private movieService = inject(MovieService);
  private reviewService = inject(ReviewService);
  private router: Router = inject(Router);

  constructor() {
    this.reviewForm = this.fb.group({
      review: ['']
    });
  }

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.params['id']);
    this.fetchMovieDetails(movieId);
  }

  fetchMovieDetails(movieId: number): void {
    this.movieService.getMovieDetails(movieId).then((details: MovieDetails) => {
      this.movieDetails = details;
    });
  }

  editMovie(): void {
    console.log('Edit movie:', this.movieDetails);
  }

  async handleDelete() {
    if (this.movieIdToDelete) {
      // const response = await this.movieService.deleteMovie(this.movieIdToDelete);
      const response = { deleted: true };
      if (response.deleted) {
        this.showDeleteModal = false;
        this.router.navigate(['']); // Redirect after deletion to homepage
        this.showModal3 = true;
        setTimeout(() => {
          this.showModal3 = false;
        }, 5000);
      }
    }
  }

  openDeleteModal(movieId: any) {
    this.movieIdToDelete = movieId;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.movieIdToDelete = null;
  }

  async handleSubmit(): Promise<void> {
    const reviewText = this.reviewForm.get('review')?.value;

    if (!this.movieDetails || !reviewText) return;

    this.resetForm();
    this.showModal1 = true; // Trigger review toast
    setTimeout(() => {
      this.showModal1 = false;
    }, 2000); // Hide toast after 2 seconds
  }

  resetForm(): void {
    this.reviewForm.reset();
    this.rating = 0;
  }

  submitReview(): void { // replace this with handleSubmit after setting global state management
    console.log('Submit review button clicked');
  }

  editReview(review: any): void {
    console.log('Edited Review', review)
  }

  async deleteReview(rr_id: any): Promise<void> {
    const response = await this.reviewService.deleteRatingAndReview(rr_id);
    if (response) {
      console.log('Review deleted successfully');
    } else {
      console.error('Failed to delete the review');
    }
  }
}


