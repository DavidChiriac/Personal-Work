import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalHierarchiesComponent } from './global-hierarchies.component';
import { GlobalHierarchiesRoutingModule } from './global-hierarchies-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GlobalHierarchiesComponent],
  imports: [
    CommonModule,
    GlobalHierarchiesRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class GlobalHierarchiesModule { }
