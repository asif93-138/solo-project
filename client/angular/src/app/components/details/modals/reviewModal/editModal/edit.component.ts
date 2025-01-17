import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  schemas: [NO_ERRORS_SCHEMA]
})

export class EditComponent {
  reviewTxt: string = '';
  rating: number = 0;
  showModal_2 = false;

  setShowModal_2(state: boolean) {
    this.showModal_2 = state;
  }

  setRating(event: any) { return; }

  onSubmit() { return; }

}
