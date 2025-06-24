import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth.guard';
import { AppRolesEnum } from '../shared/utils/app-roles';
import { AdministrationComponent } from './administration.component';

const routes: Routes = [
  { path: '', component: AdministrationComponent, children: [
    { path: 'group-management', loadChildren: () => import('./group-management/group-management.module').then(m => m.GroupManagementModule), canActivate: [authGuard], data: {roles: [AppRolesEnum.ADMIN]}},
    { path: 'module-management', loadChildren: () => import('./group-module-management/group-module-management.module').then(m => m.GroupModuleManagementModule), canActivate: [authGuard], data: {roles: [AppRolesEnum.ADMIN]}},
    { path: 'user-management', loadChildren: () => import('./user-group-management/user-group-management.module').then(m => m.UserGroupManagementModule), canActivate: [authGuard], data: {roles: [AppRolesEnum.ADMIN, AppRolesEnum.ITEMSHIERARCHYADMIN, AppRolesEnum.LEAVERS_ADMIN]}},
    { path: '', redirectTo: 'group-management', pathMatch: 'full'}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
