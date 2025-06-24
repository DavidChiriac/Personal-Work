import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DisplayService } from './shared/services/display.service';
import { MockService } from 'ng-mocks';
import { of } from 'rxjs';
import { TestingModule } from './shared/testing.module';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsightsMock: ApplicationInsights = MockService(ApplicationInsights, {
  loadAppInsights: jest.fn().mockReturnValue(of(true)),
});

jest.mock('../environments/environment', () => ({
  environment: {
    production: false,
    apiUrl: 'http://localhost',
    envName: 'local',
    appInsightsConnectionString: '123',
  },
}));

jest.mock('@microsoft/applicationinsights-web', () => ({
  ApplicationInsights: jest.fn().mockImplementation(() => ({
    loadAppInsights: jest.fn(),
  })),
}));

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const displayServiceMock: DisplayService = MockService(DisplayService, {
    setContentHeight: jest.fn(),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DisplayService, useValue: displayServiceMock },
        { provide: ApplicationInsights, useValue: appInsightsMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should verify the app insights', async () => {
    await fixture.whenStable();
    expect(component.appInsights).toBeTruthy();
  });

  it(`should have as title 'Reconcilify'`, async () => {
    await fixture.whenStable();
    expect(component.title).toEqual('Reconcilify');
  });

  it('should set content height after view initialization', async () => {
    component.ngAfterViewInit();
    await fixture.whenStable(); // Wait for all asynchronous tasks to complete
    expect(displayServiceMock.setContentHeight).toHaveBeenCalled();
  });
});
