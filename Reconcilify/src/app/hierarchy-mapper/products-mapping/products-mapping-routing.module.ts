import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsMappingComponent } from './products-mapping.component';

const routes: Routes = [
  { path: '', component: ProductsMappingComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsMappingRoutingModule { }
