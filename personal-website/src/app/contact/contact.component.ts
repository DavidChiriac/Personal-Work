import { Component } from '@angular/core';

interface IContact {
  email: string;
  location: string;
  linkedIn: string;
}

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  contact!: IContact;
}
