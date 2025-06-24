import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { TasksTableComponent } from './tasks-table/tasks-table.component';
import { NotificationsTableComponent } from './notifications-table/notifications-table.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    TasksTableComponent,
    NotificationsTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    FormsModule
  ]
})
export class DashboardModule { }
