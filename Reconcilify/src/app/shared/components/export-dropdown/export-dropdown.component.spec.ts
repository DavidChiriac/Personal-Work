import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportDropdownComponent } from './export-dropdown.component';

describe('ExportDropdownComponent', () => {
  let component: ExportDropdownComponent;
  let fixture: ComponentFixture<ExportDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle exportDialogVisible when toggleExportDialog is called', () => {
    expect(component.exportDialogVisible).toBe(false);
    component.toggleExportDialog();
    expect(component.exportDialogVisible).toBe(true);
    component.toggleExportDialog();
    expect(component.exportDialogVisible).toBe(false);
  });

  it('should emit export event with true', () => {
    const spy = jest.spyOn(component.export, 'emit');
    component.exportData(true);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit export event with false', () => {
    const spy = jest.spyOn(component.export, 'emit');
    component.exportData(false);
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should not close dialog if click target is inside .excel-export button', () => {
    const mockButton = document.createElement('button');
    mockButton.classList.add('excel-export');
    document.body.appendChild(mockButton);

    const clickEvent = new MouseEvent('click', { bubbles: true });
    jest.spyOn(mockButton, 'contains').mockReturnValue(true);

    component.exportDialogVisible = true;
    component.onOutsideClick(clickEvent);
    expect(component.exportDialogVisible).toBe(false);

    document.body.removeChild(mockButton);
  });

  it('should close dialog if click target is outside .excel-export button', () => {
    component.exportDialogVisible = true;
    const event = new MouseEvent('click', { bubbles: true });
    jest.spyOn(document, 'querySelector').mockReturnValue({
      contains: () => false,
    } as unknown as Element);
    component.onOutsideClick(event);
    expect(component.exportDialogVisible).toBe(false);
  });
});
