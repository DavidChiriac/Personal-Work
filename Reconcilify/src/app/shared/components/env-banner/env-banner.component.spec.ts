import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvBannerComponent } from './env-banner.component';

describe('EnvBannerComponent', () => {
  let component: EnvBannerComponent;
  let fixture: ComponentFixture<EnvBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnvBannerComponent]
    })
      .compileComponents();
    
    fixture = TestBed.createComponent(EnvBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
