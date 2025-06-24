import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaversComponent } from './leavers.component';

const routes: Routes = [
  { path: '', component: LeaversComponent, children: [
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
    { path: 'leaver-report', loadChildren: () => import('./leaver-report/leaver-report.module').then(m => m.LeaverReportModule)},
    { path: 'leaver-report-acknowledgement', loadChildren: () => import('./leaver-report-acknowledgement/leaver-report-acknowledgement.module').then(m => m.LeaverReportAcknowledgementModule)},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaversRoutingModule {}
