import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentralRepositoryComponent } from './central-repository/central-repository.component';
import { CentralRepositoryRoutingModule } from './central-repository-routing.module';
import { CentralRepositoryTableComponent } from './central-repository-table/central-repository-table.component';
import { EditRecordComponent } from './edit-record/edit-record.component';
import { DuplicatesTableComponent } from './edit-record/duplicates-table/duplicates-table.component';
import { ActionsSectionComponent } from './edit-record/actions-section/actions-section.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CentralRepositoryComponent,
    CentralRepositoryTableComponent,
    EditRecordComponent,
    DuplicatesTableComponent,
    ActionsSectionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CentralRepositoryRoutingModule,
    FormsModule
  ]
})
export class CentralRepositoryModule { }
