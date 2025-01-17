import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toasters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toasters.component.html',
  styleUrls: ['./toasters.component.css']
})

// Currently toasters can be seen when shown on a new page however it does not render after confirming delete or submit
export class ToastersComponent {
  //Update
  @Input() showUFC: boolean = false;
  // @Input() showUFC: boolean = true;

  //Delete
  @Input() showModal3: boolean = false;
  // @Input() showModal3: boolean = true;

  //Review Posted
  @Input() showModal1: boolean = false;
  // @Input() showModal1: boolean = true;

  @Output() refreshList = new EventEmitter<void>();
}
