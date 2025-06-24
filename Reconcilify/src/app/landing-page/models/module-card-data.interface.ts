import { AppRolesEnum } from '../../shared/utils/app-roles';

export interface IModuleCardData {
  title: string;
  description: string;
  icon: string;
  fortawesomeicon: boolean;
  buttonLabel: string;
  buttonUrl: string;
  requiredRoles: AppRolesEnum[];
  disabled: boolean;
}

export interface IQuickLink {
  module: string;
  requiredRoles: AppRolesEnum[];
  links: {
    label: string;
    routerLink?: string; //For in app links
    userGuide?: string; //For external links;
  }[];
}
