import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toasters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toasters.component.html',
  styleUrls: ['./toasters.component.css']
})

export class ToastersComponent {
  @Input() showUpdateToaster = false;
  @Input() showDeleteToaster = false;
  @Input() showReviewToaster = false;

  @Output() openToaster = new EventEmitter<void>();
}
