import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { catchError, of } from 'rxjs';
import { DisplayService } from './shared/services/display.service';
import { AuthService } from './shared/services/auth.service';
import { IUser } from './shared/interfaces/User.interface';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'Reconcilify';
  isProduction = environment.production;
  appInsights!: ApplicationInsights;
  appVersion = '';

  isAuth = false;

  constructor(
    private el: ElementRef,
    private displayService: DisplayService,
    private authService: AuthService,
    private router: Router
  ) {
    if (environment.appInsightsConnectionString) {
      const angularPlugin = new AngularPlugin();

      this.appInsights = new ApplicationInsights({
        config: {
          connectionString: environment.appInsightsConnectionString,
          extensions: [angularPlugin],
          extensionConfig: {
            [angularPlugin.identifier]: { router: this.router },
          },
        },
      });
      this.appInsights.loadAppInsights();
    }
  }

  ngOnInit(): void {
    this.isAuthenticated();
    this.authService.onLogout.pipe(untilDestroyed(this)).subscribe(() => {
      this.isAuth = false;
    });
  }

  isAuthenticated(): void {
    this.authService
      .getUserData()
      .pipe(
        untilDestroyed(this),
        catchError(() => {
          this.authService.setCurrentUser(null);
          this.isAuth = false;
          return of(null);
        })
      )
      .subscribe((user: IUser | null) => {
        if (user !== null) {
          this.authService.setCurrentUser(user);
          this.isAuth = true;
        } else {
          this.authService.setCurrentUser(null);
          this.isAuth = false;
        }
      });
  }

  ngAfterViewInit(): void {
    const pageHeight = window.innerHeight;
    const headerHeight = this.el.nativeElement.querySelector('#header')?.clientHeight ?? 120;
    const footerHeight = this.el.nativeElement.querySelector('#footer')?.clientHeight ?? 50;
    const tableHeight = pageHeight - headerHeight - footerHeight - 180;
    this.displayService.setContentHeight(tableHeight);
  }
}
