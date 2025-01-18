import { Component } from "@angular/core";
import { Movie } from "interfaces/movie";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MovieService } from "src/app/services/movieServices/movie.service";
import { GlobalStateService } from "src/app/services/globalServices/global-state.service";

@Component({
  selector: "app-my-movie",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./my-movie.component.html",
  styleUrls: ["./my-movie.component.css"],
})
export class MyMovieComponent {
  myMovie: Movie[] = [];
  user_id: Number | undefined = 0;
  constructor(
    private movieService: MovieService,
    private stateService: GlobalStateService
  ) { }

  // ngOnInit(): void {
  //   this.userService.getUser().subscribe(user => {
  //     this.userId = user ? user.user_id : null;
  //     if (this.userId) {
  //       this.fetchMyMovies(this.userId);
  //     }
  //   });
  // }
  ngOnInit(): void {
    this.user_id = this.stateService.getUser()?.user_id;
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
