import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyMapperComponent } from './hierarchy-mapper.component';

describe('HierarchyMapperComponent', () => {
  let component: HierarchyMapperComponent;
  let fixture: ComponentFixture<HierarchyMapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HierarchyMapperComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HierarchyMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
