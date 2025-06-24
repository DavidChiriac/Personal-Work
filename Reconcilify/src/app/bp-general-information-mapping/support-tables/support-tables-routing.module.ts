import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportTablesComponent } from './support-tables/support-tables.component';
import { SystemDuplicatesComponent } from './system-duplicates/system-duplicates.component';

const routes: Routes = [
  { path: 'cfin-by-category', component: SupportTablesComponent},
  { path: 'pos-customers-codes', component: SupportTablesComponent},
  { path: '92-cfin-codes', component: SupportTablesComponent},
  { path: '98-cfin-codes', component: SupportTablesComponent},
  { path: 'system-duplicates', component: SystemDuplicatesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportTablesRoutingModule { }
