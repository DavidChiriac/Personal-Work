import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BpGeneralInformationMappingComponent } from './bp-general-information-mapping.component';

const routes: Routes = [
  { path: '', component: BpGeneralInformationMappingComponent, children: [
    { path: 'central-repository', loadChildren: () => import('./central-repository/central-repository.module').then(m => m.CentralRepositoryModule)},
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
    { path: 'support-tables', loadChildren: () => import('./support-tables/support-tables.module').then(m => m.SupportTablesModule)},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BpGeneralInformationMappingRoutingModule { }
