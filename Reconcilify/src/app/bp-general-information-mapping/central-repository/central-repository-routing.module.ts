import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentralRepositoryComponent } from './central-repository/central-repository.component';
import { EditRecordComponent } from './edit-record/edit-record.component';

const routes: Routes = [
  { path: '', component: CentralRepositoryComponent, pathMatch: 'full'},
  { path: 'edit/:id', component: EditRecordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentralRepositoryRoutingModule { }
