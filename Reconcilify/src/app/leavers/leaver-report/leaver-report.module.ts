import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { LeaverReportRoutingModule } from './leaver-report-routing.module';
import { LeaverReportComponent } from './leaver-report.component';


@NgModule({
  declarations: [
    LeaverReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LeaverReportRoutingModule
  ]
})
export class LeaverReportModule { }
