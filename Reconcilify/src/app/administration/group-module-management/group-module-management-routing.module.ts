import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupModuleManagementComponent } from './group-module-management.component';

const routes: Routes = [
  { path: '', component: GroupModuleManagementComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupModuleManagementRoutingModule {}
