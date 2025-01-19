import { Router } from "@angular/router";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GenreService } from "src/app/services/genreServices/genre.service";
import { MovieService } from "src/app/services/movieServices/movie.service";
import { GlobalStateService } from "src/app/services/globalServices/global-state.service";

@Component({
  selector: "app-create-movie",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./create-movie.component.html",
  styleUrls: ["./create-movie.component.css"],
})
export class CreateMovieComponent {
  movieForm: FormGroup;
  genres: any[] = [];
  selectedGenres: string[] = [];
  newGenre: string = "";
  imageFile: File | null = null;
  imagePreview: string | null = null;
  uniqueTitleError: boolean = false;
  submitAttempted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private genreService: GenreService,
    public router: Router,
    private stateService: GlobalStateService
  ) {
    this.movieForm = this.fb.group({
      title: ["", [Validators.required]],
      desc: [""],
      release_yr: ["", [Validators.required, Validators.max(9999)]],
      director: [""],
      length: ["", [Validators.required]],
      producer: [""],
    });
  }

  ngOnInit(): void {
    this.getGenres();
  }

  getGenres(): void {
    this.genreService.getAllGenres().subscribe((res) => {
      this.genres = res;
    });
  }

  handleGenreChange(event: any): void {
    const value = event.target.value;
    if (!this.selectedGenres.includes(value) && value !== "Select a genre") {
      this.selectedGenres.push(value);
    }
  }

  handleRemoveGenre(genre: string): void {
    this.selectedGenres = this.selectedGenres.filter((g) => g !== genre);
  }

  handleAddNewGenre(): void {
    console.log("New Genre: ", this.newGenre);
    if (
      this.newGenre.trim() &&
      !this.genres.some((g) => g.genre === this.newGenre)
    ) {
      console.log("Genre: ", this.newGenre);
      this.genreService
        .createNewGenre({ genre: this.newGenre })
        .subscribe(() => {
          this.getGenres();
          this.newGenre = "";
        });
    }
  }

  handleImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.imagePreview = URL.createObjectURL(file);
    }
  }

  handleCancelImage(): void {
    this.imageFile = null;
    this.imagePreview = null;
  }

  handleSubmit(): void {
    this.submitAttempted = true;

    if (
      this.movieForm.invalid ||
      !this.imageFile ||
      this.selectedGenres.length === 0
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("image", this.imageFile);
    this.movieService.uploadImage(formData).subscribe((imageData: any) => {
      const movieData = {
        ...this.movieForm.value,
        img: imageData.filePath,
        genre: this.selectedGenres,
        user_id: this.stateService.getUser()?.user_id,
      };

      this.movieService.createMovie(movieData).subscribe((movie) => {
        console.log("Create: ", movie);
        if (movie) {
          this.router.navigate(["/"]);
        } else if (movie.error === "title must be unique") {
          this.uniqueTitleError = true;
        }
      });
    });
  }
}
