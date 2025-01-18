import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { DeleteComponent } from "./modals/deleteModal/delete.component";
import { EditComponent } from './modals/reviewModal/editModal/edit.component';
import { MUFormComponent } from "src/app/pages/edit-movie/edit-movie.component";
import { ToastersComponent } from "./toasters/toasters.component";
import { Movie, MovieDetails } from "src/app/interfaces/movie";
import { User } from "src/app/interfaces/user";
import { MovieService } from "src/app/services/movieServices/movie.service";
import { ReviewService } from "src/app/services/reviewServices/review.service";
import { GlobalStateService } from "src/app/services/globalServices/global-state.service";

@Component({
  selector: "app-details",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DeleteComponent,
    EditComponent,
    ToastersComponent,
    MUFormComponent
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit {
  userObj: User | null = null;
  userExists = false;

  movieDetails: MovieDetails | null = null;

  reviewForm: FormGroup;
  rating = 0;
  rr_id: number | null = null;
  reviewTxt: string = '';
  hasReviewed: boolean = false;

  showUpdateToaster = false;
  showDeleteToaster = false;
  showReviewToaster = false;

  showEditForm: boolean = false;
  selectedMovieId: number | undefined;

  isMovie: boolean | null = null;
  showDeleteModal: boolean = false;
  movieIdToDelete: number | null = null;
  reviewIdToDelete: number | null = null;

  showEditModal: boolean = false;

  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private reviewService = inject(ReviewService);
  private stateService: GlobalStateService = inject(GlobalStateService);
  private fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.stateService.user$.subscribe((user) => {
      this.userObj = user;
      this.userExists = !!user;
    });

    this.reviewForm = this.fb.group({
      review: [""],
    });
  }

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.params["id"]);
    this.fetchMovieDetails(movieId);
  }

  fetchMovieDetails(movieId: number): void {
    this.movieService.getMovieDetails(movieId).then((details: MovieDetails) => {
      this.movieDetails = details;
      this.hasReviewed = this.movieDetails.rr.some(
        (review: any) => this.userObj && review.user_id === this.userObj.user_id
      );
      console.log("Details: ", this.movieDetails);
    });
  }

  resetPage(): void {
    this.fetchMovieDetails(this.movieDetails?.movie_id as number);
  }

  openToaster(type: string): void {
    if (type === 'put') this.showUpdateToaster = true;
    if (type === 'delete') this.showDeleteToaster = true;
    if (type === 'post') this.showReviewToaster = true;
    this.closeToaster(type);
  }

  closeToaster(type: string, delay: number = 2500): void {
    setTimeout(() => {
      if (type === 'put') this.showUpdateToaster = false;
      if (type === 'delete') this.showDeleteToaster = false;
      if (type === 'post') this.showReviewToaster = false;
    }, delay);
  }

  openEditForm(movieId: number | undefined): void {
    if (movieId !== undefined) {
      this.router.navigate(["/edit/", movieId]);
    }
  }

  closeEditForm(): void {
    this.showEditForm = false;
  }

  editMovie(): void {
    this.showEditForm = true;
  }

  onFormSubmit(updatedMovie: Partial<Movie>): void {
    if (this.movieDetails) {
      this.movieService
        .updateMovie(this.movieDetails.movie_id, updatedMovie)
        .subscribe({
          next: () => {
            this.fetchMovieDetails(this.movieDetails!.movie_id); // Refresh the details
            this.showEditForm = false; // Hide the form after submission
          },
          error: (err) => {
            console.error("Error updating movie:", err);
          },
        });
    }
  }

  onFormCancel(): void {
    this.showEditForm = false;
  }

  openDeleteModal(id: any, isMovie: boolean): void {
    this.showDeleteModal = true;
    if (isMovie) {
      this.movieIdToDelete = id;
      this.isMovie = true;
    } else {
      this.reviewIdToDelete = id;
      this.isMovie = false;
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.movieIdToDelete = null;
    this.reviewIdToDelete = null;
  }

  async handleDelete(): Promise<void> {
    if (this.isMovie) {
      await this.deleteMovie();
    } else {
      await this.deleteReview();
    }
  }

  async deleteMovie(): Promise<void> {
    if (this.movieIdToDelete) {
      const response = await this.movieService.deleteMovie(this.movieIdToDelete);
      if (response.deleted) {
        this.closeDeleteModal();
        this.openToaster('delete');
        setTimeout(() => {
          this.router.navigate(['/mymovie']);
        }, 3000);
      }
    }
  }

  async deleteReview(): Promise<void> {
    await this.reviewService.deleteRatingAndReview(this.reviewIdToDelete);
    this.resetPage();
    this.clearRating();
    this.reviewForm.reset();
    this.showDeleteModal = false;
    this.openToaster('delete');
  }

  async handleSubmit(): Promise<void> {
    const reviewText = this.reviewForm.get("review")?.value;
    if (!this.movieDetails || !reviewText) return;
    this.resetPage();
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
      this.clearRating();
      this.reviewForm.reset();
      this.openToaster('post');
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting your review.");
    }
  }

  editReview(review: any): void {
    this.showEditModal = true;
    this.reviewTxt = review.review;
    this.rating = review.rating;
    this.rr_id = review.rr_id;
    this.reviewForm.patchValue({ review: review.review });
  }

  async submitEditedReview(event: any): Promise<void> {
    const updatedReviewData = {
      movie_id: this.movieDetails?.movie_id,
      user_id: this.userObj?.user_id,
      rating: event.rating,
      review: event.reviewTxt,
    };

    try {
      await this.reviewService.updateRatingAndReview(this.rr_id, updatedReviewData);
      this.showEditModal = false;
      this.resetPage();
      this.clearRating();
      this.reviewForm.reset();
      this.openToaster('put');
    } catch (error) {
      console.error('Error updating review:', error);
      alert('An error occurred while updating your review.');
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  ratingOpacity = "star-opacity mask mask-star-2 bg-orange-400";

  ratingHandler(id: any) {
    this.rating = id;
    // console.log(id);
    document.getElementById('star-' + id)?.setAttribute('checked', 'checked');
    this.ratingOpacity = "mask mask-star-2 bg-orange-400";
  }

  clearRating(): void {
    this.rating = 0;
  }
}
