import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-export-dropdown',
  templateUrl: './export-dropdown.component.html',
  styleUrl: './export-dropdown.component.scss',
  standalone: false
})
export class ExportDropdownComponent {
  @Input() loading!: boolean;
  @Input() tableDataLength!: number;
  @Input() selectedEntriesLength!: number;

  @Output() export = new EventEmitter();

  exportDialogVisible = false;

  toggleExportDialog(): void {
    this.exportDialogVisible = !this.exportDialogVisible;
  }

  onOutsideClick(event: Event): void {
    const exportButton = document.querySelector('.excel-export'); // Get the button
    if (exportButton) {
      if (exportButton.contains(event.target as Node)) {
        return; // Prevent closing when clicking the button
      }
    }
    this.exportDialogVisible = false;
  }

  exportData(exportAll = false): void {
    this.export.emit(exportAll);
  }
}
