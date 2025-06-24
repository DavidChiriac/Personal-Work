import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { TestingModule } from '../shared/testing.module';
import { MockService } from 'ng-mocks';
import { AuthService } from '../shared/services/auth.service';
import { BehaviorSubject } from 'rxjs';

const authServiceMock  = MockService(AuthService, {
  login: jest.fn(),
  currentUser$: new BehaviorSubject(null)
});

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update containerHeight on window resize', () => {
    // Set a mock value for the window height
    const newHeight = 800;
    jest.spyOn(window, 'innerHeight', 'get').mockReturnValue(newHeight);

    // Trigger the resize event
    component.onResize();

    expect(component.containerHeight).toBe(newHeight);
  });

  it('should call authService.login when login is called', () => {
    component.login();

    expect(authServiceMock.login).toHaveBeenCalled();
  });
});
