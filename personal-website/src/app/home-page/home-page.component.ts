import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home-page',
  imports: [ButtonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  presentation = {
    header: "Hey, I'm David.",
    description:
      'I am a frontend developer, mainly focused on Angular, with some knowledge in React and Vue.',
    image: 'assets/images/David Chiriac.jpg',
  };
}
