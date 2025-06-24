import { TestBed } from '@angular/core/testing';
import { ClipboardService } from 'ngx-clipboard';
import { CopyClipboardService } from '../copy-clipboard.service';

describe('CopyClipboardService', () => {
  let service: CopyClipboardService;
  let clipboardServiceMock: jest.Mocked<ClipboardService>;

  beforeEach(() => {
    clipboardServiceMock = {
      copy: jest.fn(),
    } as unknown as jest.Mocked<ClipboardService>;

    TestBed.configureTestingModule({
      providers: [
        CopyClipboardService,
        { provide: ClipboardService, useValue: clipboardServiceMock },
      ],
    });

    service = TestBed.inject(CopyClipboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call clipboard.copy with the correct value', () => {
    const testValue = 'Test string to copy';
    service.copyToClipboard(testValue);

    expect(clipboardServiceMock.copy).toHaveBeenCalledWith(testValue);
    expect(clipboardServiceMock.copy).toHaveBeenCalledTimes(1);
  });
});
