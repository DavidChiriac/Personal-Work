import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-env-banner',
  templateUrl: './env-banner.component.html',
  styleUrl: './env-banner.component.scss',
  standalone: false
})
export class EnvBannerComponent {
  environment = environment.envName;
}
