import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaverReportComponent } from './leaver-report.component';

const routes: Routes = [
  { path: '', component: LeaverReportComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaverReportRoutingModule {}
