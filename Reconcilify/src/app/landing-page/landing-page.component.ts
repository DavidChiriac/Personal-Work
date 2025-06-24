import { Component, OnInit } from '@angular/core';
import { IModuleCardData, IQuickLink } from './models/module-card-data.interface';
import { AuthService } from '../shared/services/auth.service';
import { quickLinks } from './models/quick-links';
import { AppRolesEnum } from '../shared/utils/app-roles';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  standalone: false
})
export class LandingPageComponent implements OnInit {
  modules: IModuleCardData[];
  userRoles?: AppRolesEnum[];
  quickLinks: IQuickLink[] = [];

  constructor(private readonly authService: AuthService) {
    this.modules = [
      {
        title: 'BP General Information Mapping',
        description: 'View and manage business partners’ general information.',
        icon: '../../assets/icons/vcm-icon.png',
        fortawesomeicon: false,
        buttonLabel: 'Access',
        buttonUrl: 'vcm',
        requiredRoles: [AppRolesEnum.ADMIN, AppRolesEnum.MANAGER, AppRolesEnum.REGULAR],
        disabled: false
      },
      {
        title: 'FnB Hierarchy Mapper',
        description: 'View and manage FnB products’ hierarchy classification.',
        icon: 'fa-solid fa-sitemap',
        fortawesomeicon: true,
        buttonLabel: 'Access',
        buttonUrl: 'FnB-MDH',
        requiredRoles: [AppRolesEnum.ADMIN, AppRolesEnum.ITEMSHIERARCHYADMIN, AppRolesEnum.ITEMSHIERARCHYEDITOR, AppRolesEnum.ITEMSHIERARCHYVIEWER],
        disabled: false
      },
      {
        title: 'Global Leavers Report',
        description: 'View and manage leaver data.',
        icon: 'fa-solid fa-person-walking-arrow-right',
        fortawesomeicon: true,
        buttonLabel: 'Access',
        buttonUrl: 'leavers',
        requiredRoles: [AppRolesEnum.ADMIN, AppRolesEnum.LEAVERS_ADMIN, AppRolesEnum.LEAVERS_ICFR_CONTROL_OWNER, AppRolesEnum.LEAVERS_STAKEHOLDER],
        disabled: false
      }
    ]; 
  }

  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();
    this.modules = this.modules.map((module: IModuleCardData) => {
      if((this.userRoles && module.requiredRoles.some((role) => this.userRoles?.includes(role))) || module.requiredRoles.length === 0){
        module.disabled = false;
      } else {
        module.disabled = true;
      }
      
      return module;
    });

    this.quickLinks = quickLinks.filter((link: IQuickLink) => this.userRoles?.includes(AppRolesEnum.ADMIN) || link?.requiredRoles.some((role) => this.userRoles?.includes(role)));
  }
}
