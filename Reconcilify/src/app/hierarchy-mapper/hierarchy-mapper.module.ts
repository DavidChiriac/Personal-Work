import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HierarchyMapperComponent } from './hierarchy-mapper.component';
import { HierarchyMapperRoutingModule } from './hierarchy-mapper-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HierarchyMapperComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HierarchyMapperRoutingModule,
    FormsModule
  ]
})
export class HierarchyMapperModule { }
