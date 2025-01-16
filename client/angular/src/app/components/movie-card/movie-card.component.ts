import { Movie } from "interfaces/movie";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-movie-card",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./movie-card.component.html",
  styleUrls: ["./movie-card.component.css"],
})
export class MovieCardComponent {
  @Input() dataObj: Movie[] = [];
}
