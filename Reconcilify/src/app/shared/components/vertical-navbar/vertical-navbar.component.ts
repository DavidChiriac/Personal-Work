import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SharedServiceService } from '../../services/shared.service';
import { AppRolesEnum } from '../../utils/app-roles';
import { AppModulesEnum } from '../../utils/app-modules';
import { fnbNavbar } from '../../../hierarchy-mapper/models/fnb-navbar-content.constant';
import { leaversNavbar } from '../../../leavers/models/leavers-navbar-content.constant';

type navbarItem = {
  label: string;
  customIcon?: string;
  requiredRoles?: AppRolesEnum[];
  routerLink?: string;
  items?: navbarItem[];
};

@Component({
  selector: 'app-vertical-navbar',
  templateUrl: './vertical-navbar.component.html',
  styleUrl: './vertical-navbar.component.scss',
  standalone: false
})
export class VerticalNavbarComponent implements OnInit {
  @Input() module!: AppModulesEnum;
  navbar: navbarItem[] = [];
  userRoles: AppRolesEnum[] = [];

  constructor(private readonly authService: AuthService, private readonly sharedService: SharedServiceService){}

  ngOnInit(): void {
    this.userRoles = this.authService.getUserRoles();

    let navbarTabs: navbarItem[] = [];
    switch(this.module){
    case (AppModulesEnum.FNB):
      navbarTabs = fnbNavbar;
      break;
    case (AppModulesEnum.LEAVERS):
      navbarTabs = leaversNavbar;
      break;
    default:
      break;
    }

    this.navbar = navbarTabs?.map(tab => {
      if(tab?.requiredRoles){
        if(this.hasAuthority(tab?.requiredRoles)){
          return tab;
        }

        return {label: ''};
      }
      return tab;
    });
  }

  hasAuthority(requiredRoles: AppRolesEnum[]): boolean {
    return this.userRoles.some((role) => requiredRoles.includes(role));
  }

  navigate(tab: navbarItem): void{
    if(tab?.label === 'Learning'){
      this.sharedService.getReconUserGuide(AppModulesEnum.FNB);
    }
  }
}
