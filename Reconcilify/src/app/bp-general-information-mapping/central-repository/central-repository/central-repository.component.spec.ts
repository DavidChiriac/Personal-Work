import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralRepositoryComponent } from './central-repository.component';
import { TestingModule } from '../../../shared/testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

describe('CentralRepositoryComponent', () => {
  let component: CentralRepositoryComponent;
  let fixture: ComponentFixture<CentralRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CentralRepositoryComponent],
      imports: [TestingModule, SharedModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CentralRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
});
