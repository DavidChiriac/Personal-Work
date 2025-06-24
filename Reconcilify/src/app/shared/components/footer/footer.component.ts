import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedServiceService } from '../../services/shared.service';
import { AppModulesEnum } from '../../utils/app-modules';

@UntilDestroy()
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: false
})
export class FooterComponent implements OnInit {
  @Input() landingPage = false;
  appVersion = '';

  constructor(private sharedService: SharedServiceService) {}

  ngOnInit(): void {
    this.sharedService
      .getAppVersion()
      .pipe(untilDestroyed(this))
      .subscribe((version: string) => {
        this.appVersion = version;
      });
  }

  goToUserGuide(): void {
    this.sharedService.getReconUserGuide(AppModulesEnum.FINANCE);
  }
}
