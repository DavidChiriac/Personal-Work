import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BpGeneralInformationMappingComponent } from './bp-general-information-mapping.component';
import { BpGeneralInformationMappingRoutingModule } from './bp-general-information-mapping-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BpGeneralInformationMappingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BpGeneralInformationMappingRoutingModule,
    FormsModule
  ]
})
export class BpGeneralInformationMappingModule { }
