import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { LeaverReportAcknowledgementComponent } from './leaver-report-acknowledgement.component';
import { LeaverReportAcknowledgementRoutingModule } from './leaver-report-acknowledgement-routing.module';


@NgModule({
  declarations: [
    LeaverReportAcknowledgementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LeaverReportAcknowledgementRoutingModule
  ]
})
export class LeaverReportAcknowledgementModule { }
