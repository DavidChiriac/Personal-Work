import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly isMobileDevice!: boolean;
  private readonly isTabletDevice!: boolean;
  private readonly isIOSDevice!: boolean;

  constructor() {
    const platformId = inject(PLATFORM_ID);
    const deviceService = inject(DeviceDetectorService);

    if (isPlatformBrowser(platformId)) {
      this.isMobileDevice = deviceService.isMobile();
      this.isTabletDevice = deviceService.isTablet();
      this.isIOSDevice = deviceService.os.includes('iOS');
    } else {
      // Default assumption for SSR or implement user-agent logic if needed
      this.isMobileDevice = false;
    }
  }

  get isMobile(): boolean {
    return this.isMobileDevice;
  }

  get isTablet(): boolean {
    return this.isTabletDevice;
  }

  get isIOS(): boolean {
    return this.isIOSDevice;
  }

  public isSafari(): boolean | null {
    return (
      /apple/i.exec(navigator.vendor) &&
      !/crios/i.exec(navigator.userAgent) &&
      !/fxios/i.exec(navigator.userAgent) &&
      !/Opera|OPT\//.exec(navigator.userAgent)
    );
  }

  public isMac(): boolean {
    return window.navigator?.platform.includes('Mac') || false;
  }
}
