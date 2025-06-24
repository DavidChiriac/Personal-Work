import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportTablesComponent } from './support-tables/support-tables.component';
import { SupportTablesRoutingModule } from './support-tables-routing.module';
import { SystemDuplicatesComponent } from './system-duplicates/system-duplicates.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SupportTablesComponent,
    SystemDuplicatesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SupportTablesRoutingModule,
    FormsModule
  ]
})
export class SupportTablesModule { }
