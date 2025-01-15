import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

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
