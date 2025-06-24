import { Component, input, InputSignal } from '@angular/core';
import { CopyClipboardService } from '../../services/copy-clipboard.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-copy-cell',
  templateUrl: './copy-cell.component.html',
  styleUrl: './copy-cell.component.scss',
  standalone: false
})
export class CopyCellComponent {
  content: InputSignal<string> = input('');

  constructor(private readonly copyClipboardService: CopyClipboardService, private readonly messageService: MessageService) {}

  copyToClipboard(event: MouseEvent): void {
    event.stopPropagation();
    this.copyClipboardService.copyToClipboard(this.content().toString().trim());
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied to clipboard!' });
  }
}
