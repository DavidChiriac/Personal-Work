import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modals-component',
  templateUrl: './modals-component.component.html',
  styleUrls: ['./modals-component.component.scss'],
  standalone: false
})
export class ModalsComponent {
  @Input() errorModalVisible: boolean = false;
  @Input() exportModalVisible: boolean = false;
  @Input() errorMessage: string = '';
  @Input() display: string = '';

  @Output() toggleErrorModal = new EventEmitter<void>();

  closeErrorModal(): void {
    this.toggleErrorModal.emit(); // just emit, don't mutate @Input()
  }
}
