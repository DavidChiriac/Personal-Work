import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FnBDashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path: '', component: FnBDashboardComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
