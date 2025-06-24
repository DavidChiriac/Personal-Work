import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, delay, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { authGuard } from '../auth.guard';
import { EventEmitter } from '@angular/core';
import { MockService } from 'ng-mocks';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IUser } from '../../interfaces/User.interface';
import { AppRolesEnum } from '../../utils/app-roles';

describe('AuthGuard', () => {
  const currentUser$ = of(null);
  const authServiceMock: AuthService = MockService(AuthService, {
    currentUser$,
    logout: jest.fn().mockReturnValue(of(null)),
    onLogout: new EventEmitter<void>(),
  });

  const routerMock: Router = MockService(Router, {
    navigate: jest.fn(),
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                roles: []
              }
            },
          },
        },
      ],
    });
  });

  it('should create', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should return true if user is logged in', fakeAsync(() => {
    let guardOutput = null;
    authServiceMock.currentUser$ = of({
      firstName: 'Valmira',
      lastName: 'Aranitasi',
    } as IUser);
    const activatedRoute = TestBed.inject(ActivatedRoute);
    const guardResponse = TestBed.runInInjectionContext(() => {
      return authGuard(
        activatedRoute.snapshot,
        {} as RouterStateSnapshot
      ) as Observable<boolean>;
    });

    guardResponse
      .pipe(delay(100))
      .subscribe((response) => (guardOutput = response));

    tick(100);
    expect(guardOutput).toBe(true);
  }));

  it('should return false if user is not logged in', fakeAsync(() => {
    let guardOutput = null;
    authServiceMock.currentUser$ = of(null);
    const activatedRoute = TestBed.inject(ActivatedRoute);
    const guardResponse = TestBed.runInInjectionContext(() => {
      return authGuard(
        activatedRoute.snapshot,
        {} as RouterStateSnapshot
      ) as Observable<boolean>;
    });

    guardResponse
      .pipe(delay(100))
      .subscribe((response) => (guardOutput = response));

    tick(100);
    expect(guardOutput).toBe(false);
  }));

  it('should redirect to landing page if the user does not have the authority', fakeAsync(() => {
    let guardOutput = null;
    authServiceMock.currentUser$ = of({
      firstName: 'Abc',
      lastName: 'Def',
      roleNames: [AppRolesEnum.ITEMSHIERARCHYEDITOR]
    } as IUser);
    const activatedRoute = TestBed.inject(ActivatedRoute);
    (activatedRoute.snapshot as any).data = {
      roles: [AppRolesEnum.ITEMSHIERARCHYADMIN]
    };
    const guardResponse = TestBed.runInInjectionContext(() => {
      return authGuard(
        activatedRoute.snapshot,
        {} as RouterStateSnapshot
      ) as Observable<boolean>;
    });

    guardResponse
      .pipe(delay(100))
      .subscribe((response) => (guardOutput = response));

    tick(100);
    expect(routerMock.navigate).toHaveBeenCalled();
    expect(guardOutput).toBe(false);
  }));
});
