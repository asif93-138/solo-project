import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CreateMovieComponent } from "src/app/pages/create-movie/create-movie.component";

@Component({
  selector: "app-toasters",
  standalone: true,
  imports: [CommonModule, CreateMovieComponent],
  templateUrl: "./toasters.component.html",
  styleUrls: ["./toasters.component.css"],
})
export class ToastersComponent {
  @Input() showUpdateToaster = false;
  @Input() showDeleteToaster = false;
  @Input() showReviewToaster = false;
  @Input() showCreateToster = false;
  @Output() openToaster = new EventEmitter<void>();
}
