import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AdministrationComponent } from './administration.component';
import { AdministrationRoutingModule } from './administration-routing.module';

@NgModule({
  declarations: [AdministrationComponent],
  imports: [CommonModule, AdministrationRoutingModule, SharedModule, FormsModule],
})
export class AdministrationModule {}
