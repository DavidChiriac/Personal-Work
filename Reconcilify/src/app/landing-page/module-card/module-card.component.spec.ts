import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ModuleCardComponent } from './module-card.component';
import { MockProvider, MockService } from 'ng-mocks';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedServiceService } from '../../shared/services/shared.service';

const mockSharedService = MockService(SharedServiceService, {
  getReconUserGuide: jest.fn()
});

describe('ModuleCardComponent', () => {
  let component: ModuleCardComponent;
  let fixture: ComponentFixture<ModuleCardComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        MockProvider(Router, { navigate: jest.fn() }),
        {
          provide: SharedServiceService,
          useValue: mockSharedService
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    component.moduleCardData = { buttonUrl: '/default-url' } as any;

    fixture.detectChanges();
  });

  it('should navigate to quickLink.routerLink if defined', () => {
    const quickLink: {label: string; routerLink: string; } = { label: 'Test', routerLink: '/test-link'};

    component.navigate(quickLink);

    expect(router.navigate).toHaveBeenCalledWith(['/test-link']);
  });

  it('should open a new tab if quickLink.url is defined', () => {
    const quickLink: {label: string; userGuide: string; } = { label: '', userGuide: 'example' };
    const getUserGuideSpy = jest.spyOn(mockSharedService, 'getReconUserGuide');

    component.navigate(quickLink);

    expect(getUserGuideSpy).toHaveBeenCalled();
  });

  it('should navigate using moduleCardData.buttonUrl if quickLink is not provided', () => {
    component.navigate();

    expect(router.navigate).toHaveBeenCalledWith(['/default-url']);
  });
});
