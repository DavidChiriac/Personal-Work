import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DeviceService } from '../shared/services/device.service';
import { CommonModule } from '@angular/common';
import { HomepageService } from './homepage.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SessionStorageService } from 'ngx-webstorage';

interface IPresentation {
  header: string;
  description: string;
  image: string;
}

@UntilDestroy()
@Component({
  selector: 'app-home-page',
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  presentation: IPresentation = {
    header: "Hey, I'm David.",
    description:
      'I am a frontend developer, mainly focused on Angular, but I previously worked with React and Vue on personal projects',
    image: 'assets/images/David Chiriac.jpg',
  };

  isMobile!: boolean;

  constructor(
    private readonly deviceService: DeviceService,
    private readonly homepageService: HomepageService,
    private readonly sessionStorage: SessionStorageService
  ) {
    this.isMobile = deviceService.isMobile();

    const homepage = sessionStorage.retrieve('homepage');
    if (homepage) {
      this.presentation = { ...homepage };
    } else {
      this.getHomepageData();
    }
  }

  getHomepageData() {
    this.homepageService
      .getHomepage()
      .pipe(untilDestroyed(this))
      .subscribe(
        (homepage: {
          data: { header: string; description: string; image: { url: string } };
        }) => {
          this.presentation = {
            header: homepage?.data?.header,
            description: homepage.data.description,
            image: homepage.data.image.url,
          };

          this.sessionStorage.store('homepage', this.presentation);
        }
      );
  }
}
