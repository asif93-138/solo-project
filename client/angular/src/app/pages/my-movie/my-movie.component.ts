import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Movie } from "interfaces/movie";
import { MovieService } from "src/app/services/movieServices/movie.service";

@Component({
  selector: "app-my-movie",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./my-movie.component.html",
  styleUrls: ["./my-movie.component.css"],
})
export class MyMovieComponent {
  myMovie: Movie[] = [];
  user_id: Number = 0;
  constructor(private movieService: MovieService) {}

  // ngOnInit(): void {
  //   this.userService.getUser().subscribe(user => {
  //     this.userId = user ? user.user_id : null;
  //     if (this.userId) {
  //       this.fetchMyMovies(this.userId);
  //     }
  //   });
  // }
  ngOnInit(): void {
    this.user_id = 7; /////////////////////////////////////////      Must remove      ///////////
    this.fetchMyMovies(this.user_id);
  }

  fetchMyMovies(user_id: any): void {
    this.movieService.getMyList(user_id).subscribe(
      (result: Movie[]) => {
        this.myMovie = result;
        console.log("My: ", this.myMovie);
      },
      (error) => {
        console.error("Error fetching movies:", error); // Logs any error
      }
    );
  }
}
