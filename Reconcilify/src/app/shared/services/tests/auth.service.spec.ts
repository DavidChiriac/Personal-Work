import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import {
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../../interfaces/User.interface';
import { TestingModule } from '../../testing.module';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  const currentUserSubjectMock: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AuthService],
    });
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', (): void => {
    expect(authService).toBeTruthy();
  });

  it('should navigate to the correct login URL', () => {
    // Arrange
    const apiUrl = environment.apiUrl;
    const expectedUrl = `${apiUrl}/oauth2/authorization/oidc`;
    const navigateSpy = jest.spyOn(window.location, 'href', 'set');

    // Act
    authService.login();

    // Assert
    expect(navigateSpy).toHaveBeenCalledWith(expectedUrl);
  });

  it('should make a POST request to logout endpoint', () => {
    // Arrange
    const expectedUrl = `${environment.apiUrl}/api/logout`;
    const mockResponse = {};

    // Act
    authService.logout().subscribe();
    const req = httpMock.expectOne(expectedUrl);

    // Assert
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  it('should return user data', () => {
    // Arrange
    const mockUser = {};

    // Act
    authService.getUserData().subscribe((userData) => {
      expect(userData).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/account`);

    // Assert
    expect(req.request.method).toEqual('GET');
    req.flush(mockUser);
  });

  it('should set current user', () => {
    // Arrange
    const user = { firstName: 'Valmira', lastName: 'Aranitasi' } as IUser;
    authService['currentUser'] = currentUserSubjectMock;
    jest.spyOn(currentUserSubjectMock, 'next');

    // Act
    authService.setCurrentUser(user);

    // Assert
    expect(currentUserSubjectMock.next).toHaveBeenCalledWith(user);
  });
});
