import {
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { SessionExpirationInterceptor } from '../session-expiration.interceptor';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MockService } from 'ng-mocks';
import { AuthService } from '../../services/auth.service';

describe('SessionExpirationInterceptor', () => {
  let interceptor: SessionExpirationInterceptor;
  let mockHandler: HttpHandler;

  const currentUser$ = of(null);
  const authServiceMock: AuthService = MockService(AuthService, {
    currentUser$,
    logout: jest.fn().mockReturnValue(of(null)),
    onLogout: new EventEmitter<void>(),
    setCurrentUser: jest.fn(),
  });

  const routerMock: Router = MockService(Router, {
    navigate: jest.fn(),
  });

  beforeEach(() => {
    interceptor = new SessionExpirationInterceptor(authServiceMock, routerMock);
    mockHandler = {
      handle: jest.fn(),
    };
  });

  it('should redirect to home page if 404 error occurs and path is not / or /login', () => {
    // Arrange
    location.pathname = '/api/test';
    const req = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({ status: 404 });
    const handleSpy = jest
      .spyOn(mockHandler, 'handle')
      .mockReturnValue(throwError(() => errorResponse));
    const redirectSpy = jest.spyOn(window.location, 'href', 'set');

    // Act & Assert
    interceptor.intercept(req, mockHandler).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
        expect(redirectSpy).toHaveBeenCalledWith('/');
      },
    });
    expect(handleSpy).toHaveBeenCalled();
  });

  it('should not redirect if 404 error occurs and path is empty', () => {
    // Arrange
    const req = new HttpRequest('GET', '');
    const errorResponse = new HttpErrorResponse({ status: 404 });
    jest
      .spyOn(mockHandler, 'handle')
      .mockReturnValue(throwError(() => errorResponse));

    const redirectSpy = jest.spyOn(window.location, 'href', 'set');

    // Act & Assert
    interceptor.intercept(req, mockHandler).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
        expect(redirectSpy).not.toHaveBeenCalled();
      },
    });
  });

  it('should not redirect if 404 error occurs and path is /login', () => {
    // Arrange
    const req = new HttpRequest('GET', '/login');
    const errorResponse = new HttpErrorResponse({ status: 404 });
    jest
      .spyOn(mockHandler, 'handle')
      .mockReturnValue(throwError(() => errorResponse));

    const redirectSpy = jest.spyOn(window.location, 'href', 'set');

    // Act & Assert
    interceptor.intercept(req, mockHandler).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
        expect(redirectSpy).not.toHaveBeenCalled();
      },
    });
  });

  it('should pass through if error is not 404', () => {
    // Arrange
    const req = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({ status: 500 });
    const handleSpy = jest
      .spyOn(mockHandler, 'handle')
      .mockReturnValue(throwError(() => errorResponse));

    // Act & Assert
    interceptor.intercept(req, mockHandler).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
      },
    });

    expect(handleSpy).toHaveBeenCalled();
  });

  it('should pass through if no error occurs', () => {
    // Arrange
    const req = new HttpRequest('GET', '/api/test');
    const response = {} as HttpEvent<any>;
    jest.spyOn(mockHandler, 'handle').mockReturnValue(of(response));

    // Act & Assert
    interceptor.intercept(req, mockHandler).subscribe((result) => {
      expect(result).toEqual(response);
    });
  });

  it('should redirect if 404 error occurs and path is different from empty and /login', () => {
    // Arrange
    location.hash = '#/login';
    const req = new HttpRequest('GET', '/login');
    const errorResponse = new HttpErrorResponse({ status: 404, url: '/login'});
    jest
      .spyOn(mockHandler, 'handle')
      .mockReturnValue(throwError(() => errorResponse));

    const redirectSpy = jest.spyOn(window.location, 'href', 'set');

    // Act & Assert
    interceptor.intercept(req, mockHandler).subscribe({
      error: (error) => {
        expect(error).toEqual(errorResponse);
        expect(redirectSpy).toHaveBeenCalled();
        expect(authServiceMock.onLogout).toHaveBeenCalled();
        expect(authServiceMock.setCurrentUser).toHaveBeenCalledWith(null);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      },
    });
  });
});
