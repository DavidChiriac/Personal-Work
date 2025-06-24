import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { VendorCustomerSummaryComponent } from './vendor-customer-summary/vendor-customer-summary.component';
import { VendorCustomerUploadComponent } from './vendor-customer-upload/vendor-customer-upload.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    VendorCustomerUploadComponent,
    VendorCustomerSummaryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    FormsModule
  ]
})
export class DashboardModule { }
