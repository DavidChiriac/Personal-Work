import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { authGuard } from './shared/guards/auth.guard';
import { AppRolesEnum } from './shared/utils/app-roles';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule), canActivate: [authGuard], pathMatch: 'full'},
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
  { path: 'vcm', loadChildren: () => import('./bp-general-information-mapping/bp-general-information-mapping.module').then(m => m.BpGeneralInformationMappingModule), canActivate: [authGuard], data: {roles: [AppRolesEnum.ADMIN, AppRolesEnum.MANAGER, AppRolesEnum.REGULAR]}},
  { path: 'FnB-MDH', loadChildren: () => import('./hierarchy-mapper/hierarchy-mapper.module').then(m => m.HierarchyMapperModule), canActivate: [authGuard],  data: {roles: [AppRolesEnum.ADMIN, AppRolesEnum.ITEMSHIERARCHYADMIN, AppRolesEnum.ITEMSHIERARCHYEDITOR, AppRolesEnum.ITEMSHIERARCHYVIEWER]}},
  { path: 'leavers', loadChildren: () => import('./leavers/leavers.module').then(m => m.LeaversModule), canActivate: [authGuard],  data: {roles: [AppRolesEnum.ADMIN, AppRolesEnum.LEAVERS_ADMIN, AppRolesEnum.LEAVERS_ICFR_CONTROL_OWNER, AppRolesEnum.LEAVERS_STAKEHOLDER]}},
  { path: 'administration', loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule), canActivate: [authGuard],  data: {roles: [AppRolesEnum.ADMIN, AppRolesEnum.ITEMSHIERARCHYADMIN]}},
  { path: '**', component: NotFoundComponent, canActivate: [authGuard]}
];

@NgModule({
  imports: [],
  exports: []
})
export class AppRoutingModule { }
