// import { CommonModule } from "@angular/common";
// import { Movie } from "src/app/interfaces/movie";
// import { Genre } from "src/app/interfaces/genre";
// import { Component, inject } from "@angular/core";
// import { GenreService } from "../../services/genreServices/genre.service";
// import { MovieService } from "../../services/movieServices/movie.service";

// @Component({
//   selector: "app-home",
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: "./home.component.html",
//   styleUrls: ["./home.component.css"],
// })
// export class HomeComponent {
//   genreList: Genre[] = [];
//   movieList: Movie[] = [];

//   genreService: GenreService = inject(GenreService);
//   movieService: MovieService = inject(MovieService);

//   constructor() {}

//   ngOnInit() {
//     this.genreService.getAllGenres().subscribe((genre: Genre[]) => {
//       this.genreList = genre;
//       //console.log("Genre: ", genre);
//     });

//     this.movieService.getAllMovies().subscribe((movies: Movie[]) => {
//       this.movieList = movies;
//       //console.log("Movie List: ", movies);
//     });
//   }
// }

import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Movie } from "src/app/interfaces/movie";
import { Genre } from "src/app/interfaces/genre";
import { Component, OnInit } from "@angular/core";
import { MovieCardComponent } from "../movie-card/movie-card.component";
import { GenreService } from "../../services/genreServices/genre.service";
import { MovieService } from "../../services/movieServices/movie.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [MovieCardComponent, FormsModule, CommonModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  data: Movie[] = [];
  initialResults: Movie[] = [];
  searchTitle: string = "";
  searchGenre: string = "";
  genres: Genre[] = [];
  showNRF: boolean = false;
  showSH: boolean = false;
  showSCB: boolean = false;

  constructor(
    private movieService: MovieService,
    private genreService: GenreService
  ) {}

  ngOnInit(): void {
    this.fetchingMovies();
    this.fetchingGenres();
  }

  fetchingMovies(): void {
    this.movieService.getAllMovies().subscribe((results: Movie[]) => {
      this.initialResults = results;
      this.data = results;
    });
  }

  fetchingGenres(): void {
    this.genreService.getAllGenres().subscribe((results: Genre[]) => {
      this.genres = results;
    });
  }

  handleSearch(): void {
    this.movieService
      .searchMovies(this.searchTitle.trim(), this.searchGenre)
      .subscribe(
        (searchData: Movie[]) => {
          if (searchData.length > 0) {
            this.data = searchData;
            this.showNRF = false;
          } else {
            this.data = [];
            this.showNRF = true;
          }
          this.showSH = true;
          this.showSCB = true;
        },
        (err: any) => {
          console.error("Error fetching data:", err);
          this.data = [];
        }
      );
  }

  resetSearch(): void {
    this.searchTitle = "";
    this.searchGenre = "";
    this.data = this.initialResults;
    this.showSH = false;
    this.showNRF = false;
    this.showSCB = false;
  }
}
