import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { TestingModule } from '../../testing.module';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { SharedServiceService } from '../../services/shared.service';

const mockSharedService: SharedServiceService = MockService(SharedServiceService, {
  getAppVersion: jest.fn().mockReturnValue(of('1.1.0')),
  getReconUserGuide: jest.fn()
});

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [TestingModule],
      providers: [
        {
          provide: SharedServiceService,
          useValue: mockSharedService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async() => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should open the user guide in a new tab', () => {
    component.goToUserGuide();

    expect(mockSharedService.getReconUserGuide).toHaveBeenCalled();
  });

  it('should get the app version', () => {
    component.ngOnInit();
    expect(component.appVersion).toEqual('1.1.0');
  });
});
