import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGroupManagementComponent } from './user-group-management.component';

const routes: Routes = [
  { path: '', component: UserGroupManagementComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserGroupManagementRoutingModule {}
