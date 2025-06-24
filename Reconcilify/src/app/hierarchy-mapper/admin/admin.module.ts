import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { GroupAccessManagementComponent } from './group-access-management/group-access-management.component';
import { AdminComponent } from './admin.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GroupAccessManagementComponent,
    AdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class AdminModule { }
