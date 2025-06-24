import { Component, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { DashboardService } from '../dashboard.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HttpResponse } from '@angular/common/http';
import saveAs from 'file-saver';
import { ToastMessageOptions } from 'primeng/api';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-vendor-customer-upload',
  templateUrl: './vendor-customer-upload.component.html',
  styleUrl: './vendor-customer-upload.component.scss',
  standalone: false
})
export class VendorCustomerUploadComponent {
  @ViewChild('fileUpload', { static: false }) fileUpload!: FileUpload;

  uploadInProgress: boolean = false;
  uploadStatus!: ToastMessageOptions;

  constructor(private readonly dashboardService: DashboardService) {}

  uploadFile(): void {
    if (this.fileUpload.files?.length > 0) {
      this.uploadInProgress = true;
      const formData = new FormData();
      formData.append('file', this.fileUpload.files[0]);

      this.dashboardService
        .uploadVendorCustomersFile(formData)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.uploadInProgress = false;
            this.fileUpload.clear();
            this.dashboardService.uploadFinished.emit();
            this.uploadStatus = {
              severity: 'success',
              detail: `The file has been uploaded successfully.`,
            };
          },
          error: (error) => {
            this.uploadInProgress = false;
            this.fileUpload.clear();
            this.uploadStatus = {
              severity: 'error',
              detail: error.error.status === 400 ? error.error.message : `The file could not be uploaded.`,
            };
          },
        });
    }
  }

  chooseFile(): void {
    this.fileUpload.choose();
  }

  downloadTemplate(): void {
    this.dashboardService
      .downloadTemplate()
      .pipe(untilDestroyed(this))
      .subscribe((res: HttpResponse<object>) => {
        if (res?.body) {
          const blob = new Blob([res.body as BlobPart], {
            type: 'octet/stream',
          });
          const filename = res.headers
            .get('content-disposition')
            ?.split(';')[1]
            .split('=')[1]
            .replace(/"/g, '');
          saveAs(blob, filename);
        }
      });
  }
}
