import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsMappingComponent } from './products-mapping.component';
import { ProductsMappingRoutingModule } from './products-mapping-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductsMappingComponent
  ],
  imports: [
    CommonModule,
    ProductsMappingRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ProductsMappingModule { }
