import { Component } from "@angular/core";

@Component({
  selector: "app-app-star",
  templateUrl: "./app-star.component.html",
  styleUrls: ["./app-star.component.css"],
})
export class AppStarComponent { }

// import { CommonModule } from "@angular/common";
// import { Component, EventEmitter, Input, Output } from "@angular/core";
// import { MatIcon } from "@angular/material/icon";

// @Component({
//   selector: "app-star-rating",
//   standalone: true,
//   imports: [MatIcon, CommonModule],
//   templateUrl: "./app-star.component.html",
//   styleUrls: ["./app-star.component.css"],
// })
// export class StarRatingComponent {
//   @Input() maxStars = 5;
//   @Input() color: string = "#bf0d0e";
//   @Output() onSendRating = new EventEmitter<number>();
//   starsArray = [];
//   rating = 0;

//   constructor() {
//     for (let index = 0; index < this.maxStars; index++) {
//       this.starsArray.push(index + 1);
//     }
//   }

//   onClickStar(star: number) {
//     this.rating = star;
//     this.onSendRating.emit(star);
//   }
// }
