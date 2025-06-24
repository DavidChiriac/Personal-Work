import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideNgxWebstorage, withLocalStorage, withNgxWebstorageConfig, withSessionStorage } from 'ngx-webstorage';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';
import { SharedModule } from './shared/shared.module';
import { SessionExpirationInterceptor } from './shared/interceptors/session-expiration.interceptor';
import { environment } from '../environments/environment';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';
import { provideRouter, RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionExpirationInterceptor,
      multi: true
    },
    ...(environment.appInsightsConnectionString
      ? [{ provide: ErrorHandler, useClass: ApplicationinsightsAngularpluginErrorService }]
      : []), // Exclude ErrorHandler in local
    provideNgxWebstorage(
      withNgxWebstorageConfig({ prefix: 'reconcilify', separator: '|', caseSensitive: true }),
      withLocalStorage(),
      withSessionStorage()
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: 'app-styles primeng'
        }
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
