import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toasters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toasters.component.html',
  styleUrls: ['./toasters.component.css']
})

export class ToastersComponent {
  @Input() showRegisterToaster = false;
  @Input() showErrorToaster = false;
  @Output() openToaster = new EventEmitter<void>();
}
