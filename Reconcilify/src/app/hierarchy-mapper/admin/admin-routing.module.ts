import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupAccessManagementComponent } from './group-access-management/group-access-management.component';
import { authGuard } from '../../shared/guards/auth.guard';
import { AppRolesEnum } from '../../shared/utils/app-roles';

const routes: Routes = [
  { path: 'group-access-management', component: GroupAccessManagementComponent, canActivate: [authGuard], data: {roles: [AppRolesEnum.ADMIN, AppRolesEnum.ITEMSHIERARCHYADMIN]} },
  { path: '', redirectTo: 'group-access-management', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
