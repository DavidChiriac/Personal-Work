import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupManagementComponent } from './group-management.component';

const routes: Routes = [
  { path: '', component: GroupManagementComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupManagementRoutingModule {}
