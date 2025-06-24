import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalHierarchiesComponent } from './global-hierarchies.component';

const routes: Routes = [
  { path: '', component: GlobalHierarchiesComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalHierarchiesRoutingModule { }
