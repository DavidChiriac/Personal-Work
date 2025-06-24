import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockService } from 'ng-mocks';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { AppRoutingModule } from '../app-routing.module';
import { DatePipe } from '@angular/common';


const sessionStorageServiceMock: SessionStorageService = MockService(SessionStorageService, {
  clear: jest.fn().mockReturnValue(true),
  retrieve: jest.fn().mockReturnValue(true),
  store: jest.fn().mockReturnValue(true),
  observe: jest.fn().mockReturnValue(true),
  getStrategyName: jest.fn().mockReturnValue(true)
});

const localStorageServiceMock: LocalStorageService = MockService(LocalStorageService, {
  clear: jest.fn().mockReturnValue(true),
  retrieve: jest.fn().mockReturnValue(true),
  store: jest.fn().mockReturnValue(true),
  observe: jest.fn().mockReturnValue(true),
  getStrategyName: jest.fn().mockReturnValue(true)
});

@NgModule({
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: SessionStorageService,
      useValue: sessionStorageServiceMock
    },
    {
      provide: LocalStorageService,
      useValue: localStorageServiceMock
    },
    provideHttpClient(),
    provideHttpClientTesting(),
    MessageService,
    DatePipe
  ]
})
export class TestingModule { }
