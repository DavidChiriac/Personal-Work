import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerticalNavbarComponent } from './vertical-navbar.component';
import { AuthService } from '../../services/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestingModule } from '../../testing.module';
import { AppRolesEnum } from '../../utils/app-roles';
import { MockService } from 'ng-mocks';
import { SharedServiceService } from '../../services/shared.service';

const mockSharedService = MockService(SharedServiceService, {
  getReconUserGuide: jest.fn()
});

describe('VerticalNavbarComponent', () => {
  let component: VerticalNavbarComponent;
  let fixture: ComponentFixture<VerticalNavbarComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    const authServiceMock = {
      getUserRoles: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SharedServiceService, useValue: mockSharedService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalNavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set userRole from authService on ngOnInit', () => {
    const mockUserRole = [AppRolesEnum.ADMIN];
    jest.spyOn(authService, 'getUserRoles').mockReturnValue(mockUserRole);

    component.ngOnInit();

    expect(component.userRoles).toBe(mockUserRole);
  });

  it('should return true if user has required roles in hasAuthority method', () => {
    const mockUserRole = [AppRolesEnum.ADMIN];
    component.userRoles = mockUserRole;

    const requiredRoles = [AppRolesEnum.ADMIN, AppRolesEnum.MANAGER];

    const hasAuthority = component.hasAuthority(requiredRoles);

    expect(hasAuthority).toBe(true);
  });

  it('should return false if user does not have required roles in hasAuthority method', () => {
    const mockUserRole = [AppRolesEnum.REGULAR];
    component.userRoles = mockUserRole;

    const requiredRoles = [AppRolesEnum.ADMIN, AppRolesEnum.MANAGER];

    const hasAuthority = component.hasAuthority(requiredRoles);

    expect(hasAuthority).toBe(false);
  });

  it('should call the user guide endpoint', () => {
    component.navigate({label: 'Learning'});

    expect(mockSharedService.getReconUserGuide).toHaveBeenCalled();
  });
});
