import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MovieDetails } from 'src/app/interfaces/movie';
import { MovieService } from 'src/app/services/movieServices/movie.service';
import { ReviewService } from 'src/app/services/reviewServices/review.service';
import { DeleteComponent } from "./modals/movieModal/deleteModal/delete/delete.component";
import { ToastersComponent } from './modals/toasters/toasters.component';
import { GlobalStateService } from 'src/app/services/globalServices/global-state.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DeleteComponent, ToastersComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit {
  hasReviewed: boolean = false;
  userObj: User | null = null;
  userExists = false;
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
  private stateService: GlobalStateService = inject(GlobalStateService)

  constructor() {
    this.stateService.user$.subscribe((user) => {
      this.userObj = user;
      this.userExists = !!user;
    });

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
      this.hasReviewed = this.movieDetails.rr.some(
        (review: any) => this.userObj && review.user_id === this.userObj.user_id
      );
    });
  }

  editMovie(): void {
    console.log('Edit movie:', this.movieDetails);
  }

  async handleDelete() {
    if (this.movieIdToDelete) {
      const response = await this.movieService.deleteMovie(this.movieIdToDelete);
      if (response.deleted) {
        this.showDeleteModal = false;
        this.router.navigate(['']);
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
    this.resetPage();
  }

  resetPage(): void {
    this.fetchMovieDetails(this.movieDetails?.movie_id as number);
  }

  async submitReview(): Promise<void> {
    const reviewData = {
      movie_id: this.movieDetails?.movie_id,
      user_id: this.userObj?.user_id,
      rating: this.rating,
      review: this.reviewForm.value.review,
    };

    try {
      await this.reviewService.createRatingAndReview(reviewData);
      this.resetPage();
      this.clearReviewFields();
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review.');
    }
  }

  clearReviewFields(): void {
    this.rating = 0;
    this.reviewForm.reset({ review: '' });
  }

  editReview(review: any): void {
    console.log('Edited Review', review)
  }

  async deleteReview(rr_id: any): Promise<void> {
    await this.reviewService.deleteRatingAndReview(rr_id);
    this.resetPage();
    alert('Review deleted successfully');
  }
}


