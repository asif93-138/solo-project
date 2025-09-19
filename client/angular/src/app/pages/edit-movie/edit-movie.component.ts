import { Movie } from "interfaces/movie";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MovieService } from "src/app/services/movieServices/movie.service";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-mu-form",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./edit-movie.component.html",
  styleUrls: ["./edit-movie.component.css"],
})
export class MUFormComponent implements OnInit {
  formData: Partial<Movie> = {};
  imageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.params["id"]);
    this.fetchMovieDetails(movieId);
  }

  fetchMovieDetails(movieId: number): void {
    this.movieService.getMovieDetails(movieId).then((details: Movie) => {
      this.formData = details;
      console.log("Details: ", this.formData);
    });
  }

  handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    if (this.formData) {
      this.formData = {
        ...this.formData,
        [name]: name === "release_yr" || name === "length" ? +value : value,
      };
    }
  }

  handleImageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.imageFile = file;
      this.imagePreview = URL.createObjectURL(file);
    }
  }

  handleCancelImage(): void {
    this.imageFile = null;
    this.imagePreview = null;
  }

  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.formData) return;

    const formDataCopy = { ...this.formData };
    if (this.imageFile) {
      const formDataImage = new FormData();
      formDataImage.append("image", this.imageFile);

      try {
        const imageResponse = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formDataImage,
        });
        const imageData = await imageResponse.json();
        if (imageData.filePath) {
          formDataCopy.img = imageData.filePath;
        }
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }

    this.movieService
      .updateMovie(this.formData.movie_id, formDataCopy)
      .subscribe(
        (response) => {
          console.log("Movie updated successfully", response);
          this.router.navigate([`/details/${this.formData.movie_id}`]);
        },
        (error) => {
          console.error("Error updating movie", error);
        }
      );
  }

  handleCancel(): void {
    this.router.navigate([`/details/${this.formData.movie_id}`]);
  }
}
