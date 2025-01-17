import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})

export class DeleteComponent {
  @Input() showModal: boolean = false; // To control modal visibility
  @Output() confirm = new EventEmitter<void>(); // Emits when confirm button is clicked
  @Output() cancel = new EventEmitter<void>(); // Emits when cancel button is clicked

  confirmDelete() {
    this.confirm.emit(); // Notify parent component to handle deletion
  }

  closeModal() {
    this.cancel.emit(); // Notify parent component to close the modal
  }
}
