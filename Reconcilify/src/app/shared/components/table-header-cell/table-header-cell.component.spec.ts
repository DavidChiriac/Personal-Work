import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableHeaderCellComponent } from './table-header-cell.component';
import { Table } from 'primeng/table';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TableHeaderCellComponent', () => {
  let component: TableHeaderCellComponent;
  let fixture: ComponentFixture<TableHeaderCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableHeaderCellComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TableHeaderCellComponent);
    component = fixture.componentInstance;
    component.col = { field: '', header: '' };
    component.table = {} as Table;
    component.noOfFrozenColumns = 0;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewChecked', () => {
    it('should populate statusFilters from statusOptions', () => {
      component.statusOptions = [true, false];
      component.ngAfterViewChecked();
      expect(component.statusFilters).toEqual([
        { label: 'Active', active: true },
        { label: 'Inactive', active: false }
      ]);
    });

    it('should populate acknowledgeFilters from acknowledgeOptions', () => {
      component.acknowledgeOptions = [1, 2];
      component.ngAfterViewChecked();
      expect(component.acknowledgeFilters).toEqual([
        { label: 'Pending', status: 1 },
        { label: 'Acknowledged', status: 2 }
      ]);
    });

    it('should populate backdatedLeaverFilters from backdatedLeaverOptions', () => {
      component.backdatedLeaverOptions = [true, false];
      component.ngAfterViewChecked();
      expect(component.backdatedLeaverFilters).toEqual([
        { label: 'Yes', value: true },
        { label: 'No', value: false }
      ]);
    });

    it('should not duplicate filters', () => {
      component.statusOptions = [true, true];
      component.ngAfterViewChecked();
      expect(component.statusFilters.length).toBe(1);
    });
  });

  describe('onSort', () => {
    it('should emit sort event with field and event', () => {
      const sortSpy = jest.spyOn(component.sort, 'emit');
      const dummyEvent = new Event('click');
      component.onSort('name', dummyEvent);
      expect(sortSpy).toHaveBeenCalledWith({ field: 'name', event: dummyEvent });
    });
  });

  describe('toggleFrozeOnColumn', () => {
    it('should increase frozen columns and emit freezeColumn', () => {
      const freezeSpy = jest.spyOn(component.freezeColumn, 'emit');
      const col = { field: 'name', header: 'Name' };
      component.toggleFrozeOnColumn(col, true);
      expect(component.noOfFrozenColumns).toBe(1);
      expect(freezeSpy).toHaveBeenCalledWith({ col, newFrozenStatus: true });
    });

    it('should decrease frozen columns and emit freezeColumn', () => {
      component.noOfFrozenColumns = 2;
      const freezeSpy = jest.spyOn(component.freezeColumn, 'emit');
      const col = { field: 'name', header: 'Name' };
      component.toggleFrozeOnColumn(col, false);
      expect(component.noOfFrozenColumns).toBe(1);
      expect(freezeSpy).toHaveBeenCalledWith({ col, newFrozenStatus: false });
    });
  });
});
