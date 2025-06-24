import { AppRolesEnum } from '../../shared/utils/app-roles';

export const fnbNavbar = [
  {
    label: 'Dashboard',
    routerLink: 'dashboard',
    customIcon: 'fa-solid fa-gauge'
  },
  {
    label: 'Products Mapping',
    routerLink: 'products-mapping',
    customIcon: 'fa-solid fa-sitemap'
  },
  {
    label: 'Global Hierarchies',
    routerLink: 'global-hierarchies',
    customIcon: 'fa-solid fa-globe'
  },
  {
    label: 'Admin',
    customIcon: 'fa-solid fa-wrench',
    requiredRoles: [AppRolesEnum.ADMIN, AppRolesEnum.ITEMSHIERARCHYADMIN],
    routerLink: 'admin/group-access-management'
  },
  {
    label: 'Learning',
    customIcon: 'fa-solid fa-book-open-reader'
  },
];
