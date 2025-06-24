import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupManagementComponent } from './user-group-management.component';
import { UserGroupManagementRoutingModule } from './user-group-management-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserGroupManagementComponent
  ],
  imports: [
    CommonModule,
    UserGroupManagementRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class UserGroupManagementModule { }
