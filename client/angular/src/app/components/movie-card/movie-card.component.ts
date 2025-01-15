import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Movie } from "interfaces/movie";

@Component({
  selector: "app-movie-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./movie-card.component.html",
  styleUrls: ["./movie-card.component.css"],
})
export class MovieCardComponent {
  @Input() dataObj: Movie[] = [];
}
