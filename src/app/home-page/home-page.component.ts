import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DeviceService } from '../shared/services/device.service';
import { CommonModule } from '@angular/common';

interface IPresentation {
  header: string;
  description: string;
  image: string;
}

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

  constructor(private readonly deviceService: DeviceService) {
    this.isMobile = deviceService.isMobile;
  }
}
