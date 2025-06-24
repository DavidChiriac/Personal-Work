import { TestBed } from '@angular/core/testing';
import { DisplayService } from '../display.service';

describe('DisplayService', () => {
  let displayService: DisplayService;

  beforeEach(() => {
    displayService = TestBed.inject(DisplayService);
  });

  it('should create', (): void => {
    expect(displayService).toBeTruthy();
  });

  it('should set content height', () => {
    // Arrange
    const height = 500;

    // Act
    displayService.setContentHeight(height);

    // Assert
    displayService.contentHeight$.subscribe((value) => {
      expect(value).toEqual(height);
    });
  });

  it('should update content height on window resize', () => {
    // Arrange
    const mockInnerHeight = 1000;
    const mockHeaderHeight = 100;
    const mockFooterHeight = 50;
    const expectedHeight =
      mockInnerHeight - mockHeaderHeight - mockFooterHeight - 180;

    Object.defineProperty(window, 'innerHeight', {
      value: mockInnerHeight,
      writable: true,
    });
    document.body.innerHTML = `<div id="header" style="height:${mockHeaderHeight}px"></div>
                               <div id="footer" style="height:${mockFooterHeight}px"></div>`;

    // Act
    window.dispatchEvent(new Event('resize'));

    // Assert
    displayService.contentHeight$.subscribe((value) => {
      expect(value).toEqual(expectedHeight);
    });
  });
});
