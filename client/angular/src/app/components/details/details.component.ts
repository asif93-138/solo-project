import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { Movie, MovieDetails } from "src/app/interfaces/movie";
import { MovieService } from "src/app/services/movieServices/movie.service";
import { ReviewService } from "src/app/services/reviewServices/review.service";
import { DeleteComponent } from "./modals/deleteModal/delete.component";
import { EditComponent } from './modals/reviewModal/editModal/edit.component';
import { MUFormComponent } from "src/app/pages/edit-movie/edit-movie.component";
import { User } from "src/app/interfaces/user";
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
    MUFormComponent
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit {
  reviewTxt: string = '';
  hasReviewed: boolean = false;
  userObj: User | null = null;
  userExists = false;
  movieDetails: MovieDetails | null = null;
  reviewForm: FormGroup;
  rating = 0;
  rr_id: number | null = null;
  movie: boolean | null = null;

  // States for the toaster notifications
  showUpdateToaster = false;
  showDeleteToaster = false;
  showReviewToaster = false;

  //Movie Edit Page
  showEditForm: boolean = false; // New flag for showing the edit form
  selectedMovieId: number | undefined;

  //Delete Movie Prompt/Modal
  showDeleteModal: boolean = false;
  movieIdToDelete: number | null = null;
  reviewIdToDelete: number | null = null;

  //Edit Review Modal
  showEditModal: boolean = false;

  private route: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);
  private movieService = inject(MovieService);
  private reviewService = inject(ReviewService);
  private router: Router = inject(Router);
  private stateService: GlobalStateService = inject(GlobalStateService);

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
    this.showEditForm = false; // Hide the form if canceled
  }

  openToaster(type: string): void {
    if (type === 'put') this.showUpdateToaster = true;
    if (type === 'delete') this.showDeleteToaster = true;
    if (type === 'post') this.showReviewToaster = true;
    this.closeToaster(type);
  }

  closeToaster(type: string, delay: number = 2000): void {
    setTimeout(() => {
      if (type === 'put') this.showUpdateToaster = false;
      if (type === 'delete') this.showDeleteToaster = false;
      if (type === 'post') this.showReviewToaster = false;
    }, delay);
  }

  openDeleteModal(id: any, movie: boolean) {
    this.showDeleteModal = true;
    if (movie) {
      this.movieIdToDelete = id;
      this.movie = true;
    } else {
      this.reviewIdToDelete = id;
      this.movie = false;
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.movieIdToDelete = null;
    this.reviewIdToDelete = null;
  }

  async handleDelete() {
    if (this.movie) {
      await this.deleteMovie();
    } else {
      await this.deleteReview();
    }
  }

  async deleteMovie() {
    if (this.movieIdToDelete) {
      const response = await this.movieService.deleteMovie(this.movieIdToDelete);
      if (response.deleted) {
        this.closeDeleteModal();
        this.openToaster('delete');
        setTimeout(() => {
          this.router.navigate(['/mymovie']);
        }, 3500);
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
      this.clearRating;
      this.reviewForm.reset();
      this.openToaster('post');
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting your review.");
    }
  }

  clearRating(): void {
    this.rating = 0;
  }

  editReview(review: any): void {
    console.log("edit review....")
    this.showEditModal = true;
    this.reviewTxt = review.review;  // Set the reviewTxt to the current review's text
    this.rating = review.rating;     // Set the rating to the current review's rating
    this.rr_id = review.rr_id;
    this.reviewForm.patchValue({ review: review.review });  // Pre-fill the form with the review text
    // You could also set up a flag to toggle edit mode if needed
  }

  async submitEditedReview(event: any): Promise<void> {
    console.log("Event in submitEditedReview:", event);
    const updatedReviewData = {
      movie_id: this.movieDetails?.movie_id,
      user_id: this.userObj?.user_id,
      rating: event.rating,
      review: event.reviewTxt,
    };

    try {
      await this.reviewService.updateRatingAndReview(this.rr_id, updatedReviewData); // Call a service method to update the review
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

  closeEditModal() {
    this.showEditModal = false;
  }


}
