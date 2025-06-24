import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CopyCellComponent } from './copy-cell.component';
import { CopyClipboardService } from '../../services/copy-clipboard.service';
import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestingModule } from '../../testing.module';

class MockCopyClipboardService {
  copyToClipboard = jest.fn();
}

@Component({
  template: `<app-copy-cell [content]="content"></app-copy-cell>`,
  standalone: false
})
class TestHostComponent {
  content = signal(' Test Content ');
}

describe('CopyCellComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let copyClipboardService: MockCopyClipboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      declarations: [CopyCellComponent, TestHostComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: CopyClipboardService, useClass: MockCopyClipboardService }],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    copyClipboardService = TestBed.inject(CopyClipboardService) as unknown as MockCopyClipboardService;
  });

  it('should create the component', () => {
    const copyCellDebugElement = hostFixture.debugElement.query((de) => de.name === 'app-copy-cell');
    expect(copyCellDebugElement).toBeTruthy();
  });

  it('should call copyToClipboard with trimmed content', () => {
    const mockEvent = new MouseEvent('click');
    jest.spyOn(mockEvent, 'stopPropagation');

    const copyCellDebugElement = hostFixture.debugElement.query((de) => de.name === 'app-copy-cell');
    const copyCellInstance = copyCellDebugElement.componentInstance as CopyCellComponent;

    copyCellInstance.copyToClipboard(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(copyClipboardService.copyToClipboard).toHaveBeenCalledWith('[Signal:  Test Content ]');
  });
});
