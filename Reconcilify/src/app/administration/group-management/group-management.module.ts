import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupManagementComponent } from './group-management.component';
import { GroupManagementRoutingModule } from './group-management-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GroupManagementComponent
  ],
  imports: [
    CommonModule,
    GroupManagementRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class GroupManagementModule { }
