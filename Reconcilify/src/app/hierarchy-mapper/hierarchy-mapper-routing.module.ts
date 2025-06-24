import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HierarchyMapperComponent } from './hierarchy-mapper.component';

const routes: Routes = [
  { path: '', component: HierarchyMapperComponent, children: [
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
    { path: 'products-mapping', loadChildren: () => import('./products-mapping/products-mapping.module').then(m => m.ProductsMappingModule)},
    { path: 'global-hierarchies', loadChildren: () => import('./global-hierarchies/global-hierarchies.module').then(m => m.GlobalHierarchiesModule)},
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HierarchyMapperRoutingModule {}
