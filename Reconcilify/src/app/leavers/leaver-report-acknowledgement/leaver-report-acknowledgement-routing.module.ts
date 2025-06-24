import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaverReportAcknowledgementComponent } from './leaver-report-acknowledgement.component';

const routes: Routes = [
  { path: '', component: LeaverReportAcknowledgementComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaverReportAcknowledgementRoutingModule {}
