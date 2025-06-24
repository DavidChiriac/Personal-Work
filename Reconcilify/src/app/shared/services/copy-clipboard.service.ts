import { Injectable } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

@Injectable({
  providedIn: 'root'
})
export class CopyClipboardService {

  constructor(private readonly clipboard: ClipboardService) { }

  copyToClipboard(value: string): void {
    this.clipboard.copy(value);
  }
}
