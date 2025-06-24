import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaversComponent } from './leavers.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { LeaversRoutingModule } from './leavers-routing.module';


@NgModule({
  declarations: [
    LeaversComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    LeaversRoutingModule
  ]
})
export class LeaversModule { }
