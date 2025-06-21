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
    header: '',
    description: '',
    image: '',
  };
}
