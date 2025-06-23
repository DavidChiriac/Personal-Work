import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

interface IPresentation {
  header: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-home-page',
  imports: [ButtonModule, RouterModule],
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
}
