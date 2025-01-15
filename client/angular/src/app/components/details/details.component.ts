import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MovieDetails } from 'src/app/interfaces/movie';
import { MovieService } from 'src/app/services/movieServices/movie.service';
import { ReviewService } from 'src/app/services/reviewServices/review.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit {
  movieDetails: MovieDetails | null = null;
  rating = 0;
  reviewForm: FormGroup;
  refresh = 0;
  showUFC = false;

  private route: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);
  private movieService = inject(MovieService);
  private reviewService = inject(ReviewService);

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

  async handleSubmit(): Promise<void> {
    const reviewText = this.reviewForm.get('review')?.value;

    if (!this.movieDetails || !reviewText) return;

    this.resetForm();
    this.triggerRefresh();
  }

  resetForm(): void {
    this.reviewForm.reset();
    this.rating = 0;
  }

  triggerRefresh(): void {
    this.refresh++;
    this.showUFC = true;
    setTimeout(() => {
      this.showUFC = false;
    }, 1500);
  }

  editMovie(): void {
    console.log('Edit movie:', this.movieDetails);
  }

  async deleteMovie(movie_id: any): Promise<void> {
    const response = await this.movieService.deleteMovie(movie_id);
    if (response) {
      console.log('Movie deleted successfully');
    } else {
      console.error('Failed to delete the movie');
    }
  }

  submitReview(): void {
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


