import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupModuleManagementComponent } from './group-module-management.component';
import { GroupModuleManagementRoutingModule } from './group-module-management-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GroupModuleManagementComponent
  ],
  imports: [
    CommonModule,
    GroupModuleManagementRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class GroupModuleManagementModule { }
