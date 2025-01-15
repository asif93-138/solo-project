import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-card',
  standalone: true,
<<<<<<< HEAD:client/angular/src/app/details/details.component.ts
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
=======
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
>>>>>>> 4e1d4945721efa521daa21407172f64ebbb9e7c0:client/angular/src/app/components/movie-card/movie-card.component.ts

export class DetailsComponent {
  // route: ActivatedRoute = inject(ActivatedRoute);
  // movieService = inject(movieService);
  // movieLocation: MovieLocation | undefined;
  applyForm = new FormGroup({
    //some code
  });
  constructor() {
    // const movieLocationId = Number(this.route.snapshot.params['id']);
    // this.movieService.getMovieLocationById(movieLocationId).then(movieLocation => {
    //   this.movieLocation = movieLocation;
    // });
  }
  submitApplication() {
    // this.movieService.submitApplication(
    //some Code
    // );
  }
}
