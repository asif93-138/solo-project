import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Movie } from "src/app/interfaces/movie";
import { Genre } from "src/app/interfaces/genre";
import { GenreService } from "src/app/services/genre.service";
import { MovieService } from "src/app/services/movie.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  genreList: Genre[] = [];
  movieList: Movie[] = [];

  genreService: GenreService = inject(GenreService);
  movieService: MovieService = inject(MovieService);

  constructor() {
    this.genreService.getAllGenre().then((genre: Genre[]) => {
      this.genreList = genre;
    });

    this.movieService.getAllMovies().then((movie: Movie[]) => {
      this.movieList = movie;
    });
  }
}
