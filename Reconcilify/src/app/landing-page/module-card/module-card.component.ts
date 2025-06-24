import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IModuleCardData, IQuickLink } from '../models/module-card-data.interface';
import { SharedServiceService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-module-card',
  templateUrl: './module-card.component.html',
  styleUrl: './module-card.component.scss',
  standalone: false
})
export class ModuleCardComponent {
  @Input() moduleCardData!: IModuleCardData;
  @Input() quickLinks: IQuickLink[] = [];
  @Input() isQuickLinksCard = false;

  constructor(private readonly router: Router, private readonly sharedService: SharedServiceService) {}
  
  navigate(quickLink?: {label: string; routerLink?: string; userGuide?: string; }): void {      
    if(quickLink){
      if(quickLink.routerLink){
        this.router.navigate([quickLink.routerLink]);
      } else if(quickLink.userGuide){
        this.sharedService.getReconUserGuide(quickLink.userGuide);        
      }
    } else {
      this.router.navigate([this.moduleCardData.buttonUrl]);
    }
  }
}
