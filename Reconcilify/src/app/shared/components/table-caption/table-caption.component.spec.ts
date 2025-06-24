import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table } from 'primeng/table';
import { TableCaptionComponent } from './table-caption.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TableCaptionComponent', () => {
  let component: TableCaptionComponent;
  let fixture: ComponentFixture<TableCaptionComponent>;
  let mockTable: jest.Mocked<Table>;

  beforeEach(async () => {
    mockTable = {
      ...jest.requireActual('primeng/table'),
      filterGlobal: jest.fn(),
      clearFilterValues: jest.fn()
    } as unknown as jest.Mocked<Table>;

    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TableCaptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCaptionComponent);
    component = fixture.componentInstance;
    component.dt = mockTable;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set filter for global search with current text', () => {
    component.globalSearchText = 'test';
    component.filterGlobal();

    expect(mockTable.filterGlobal).toHaveBeenCalledWith('test', 'contains');
  });

  it('should clear global search text and filter', () => {
    component.globalSearchText = 'test';
    component.clearGlobalSearchText();

    expect(component.globalSearchText).toBe('');
    expect(mockTable.filterGlobal).toHaveBeenCalledWith('', 'contains');
  });

  it('should emit clearFilters event and clear global search text on clearAll', () => {
    jest.spyOn(component.clearFilters, 'emit');

    component.clearAll();

    expect(component.clearFilters.emit).toHaveBeenCalled();
    expect(component.globalSearchText).toBe('');
    expect(mockTable.filterGlobal).toHaveBeenCalledWith('', 'contains');
  });
});
