import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BpGeneralInformationMappingComponent } from './bp-general-information-mapping.component';
import { TestingModule } from '../shared/testing.module';


describe('AppComponent', () => {
  let component: BpGeneralInformationMappingComponent;
  let fixture: ComponentFixture<BpGeneralInformationMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BpGeneralInformationMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
});
