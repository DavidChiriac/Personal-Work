import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorCustomerUploadComponent } from './vendor-customer-upload.component';
import { TestingModule } from '../../../shared/testing.module';
import { MockService } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';

describe('VendorCustomerUploadComponent', () => {
  let component: VendorCustomerUploadComponent;
  let fixture: ComponentFixture<VendorCustomerUploadComponent>;
  let fileUpload: any;

  const dashboardServiceMock: DashboardService = MockService(DashboardService, {
    uploadVendorCustomersFile: jest.fn().mockReturnValue(of([])),
    downloadTemplate: jest.fn().mockReturnValue(of([])),
    uploadFinished: new EventEmitter<void>(),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorCustomerUploadComponent],
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceMock },
      ],
    }).compileComponents();
    fileUpload = {
      files: [{ name: 'example.xls', size: 1234 }],
      clear: jest.fn(),
      choose: jest.fn(),
    };
    fixture = TestBed.createComponent(VendorCustomerUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should upload file', () => {
    // Arrange
    const successMessage = {
      severity: 'success',
      detail: 'The file has been uploaded successfully.',
    };
    component.fileUpload = fileUpload;

    // Act
    component.uploadFile();

    // Assert
    expect(component.uploadInProgress).toBe(false);
    expect(dashboardServiceMock.uploadVendorCustomersFile).toHaveBeenCalled();
    expect(fileUpload.clear).toHaveBeenCalled();
    expect(component.uploadStatus).toEqual(successMessage);
  });

  it('should handle upload failure', () => {
    // Arrange
    component.fileUpload = fileUpload;
    let errorResponse = {error: {message: 'Upload failed', status: 400}};
    jest
      .spyOn(dashboardServiceMock, 'uploadVendorCustomersFile')
      .mockReturnValueOnce(throwError(() => errorResponse));

    // Act
    component.uploadFile();

    // Assert
    expect(component.uploadInProgress).toBe(false);
    expect(fileUpload.clear).toHaveBeenCalled();
    expect(component.uploadStatus).toEqual({ severity: 'error', detail: 'Upload failed' });

    errorResponse = {error: {message: 'Upload failed', status: 500}};
    jest
      .spyOn(dashboardServiceMock, 'uploadVendorCustomersFile')
      .mockReturnValueOnce(throwError(() => errorResponse));

    // Act
    component.uploadFile();

    // Assert
    expect(component.uploadInProgress).toBe(false);
    expect(fileUpload.clear).toHaveBeenCalled();
    expect(component.uploadStatus).toEqual({ severity: 'error', detail: 'The file could not be uploaded.' });
  });

  it('should call choose method of fileUpload', () => {
    // Arrange
    const spyOnChoose = jest.spyOn(fileUpload, 'choose');
    component.fileUpload = fileUpload;

    // Act
    component.chooseFile();

    // Assert
    expect(spyOnChoose).toHaveBeenCalled();
  });

  it('should download template', () => {
    // Act
    component.downloadTemplate();

    // Assert
    expect(dashboardServiceMock.downloadTemplate).toHaveBeenCalled();
  });
});
