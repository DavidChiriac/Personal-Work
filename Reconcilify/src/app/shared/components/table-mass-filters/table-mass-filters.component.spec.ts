import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMassFiltersComponent } from './table-mass-filters.component';

describe('TableMassFiltersComponent', () => {
  let component: TableMassFiltersComponent;
  let fixture: ComponentFixture<TableMassFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableMassFiltersComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableMassFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
