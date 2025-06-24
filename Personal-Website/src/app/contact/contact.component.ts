import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DeviceService } from '../shared/services/device.service';

interface IContact {
  email: string;
  location: string;
  linkedIn: string;
}

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  contact: IContact = {
    email: 'chiriacdavid74@gmail.com',
    location: 'Suceava',
    linkedIn: 'https://www.linkedin.com/in/david-chiriac-85a321214/',
  };

  isMobile!: boolean;

  constructor(private readonly deviceService: DeviceService) {
    this.isMobile = deviceService.isMobile();
  }
}
