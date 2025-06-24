import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  standalone: false
})
export class ModalComponent {
  @Input() modalVisible = false;
  @Input() modalWidth = '40';
}
