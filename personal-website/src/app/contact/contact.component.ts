import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  contact = {
    email: 'chiriacdavid74@gmail.com',
    location: 'Suceava, Romania',
    linkedIn: 'https://www.linkedin.com/in/david-chiriac-85a321214/',
  };
}
