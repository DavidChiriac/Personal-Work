import { AppModulesEnum } from '../../shared/utils/app-modules';
import { AppRolesEnum } from '../../shared/utils/app-roles';
import { IQuickLink } from './module-card-data.interface';

export const quickLinks: IQuickLink[] = [
  {
    module: 'BP General Infomation Mapping',
    requiredRoles: [AppRolesEnum.MANAGER, AppRolesEnum.REGULAR],
    links: [
      {
        label: 'User Guide',
        userGuide: AppModulesEnum.FINANCE,
      },
    ],
  },
  {
    module: 'FnB Hierarchy Mapper',
    requiredRoles: [
      AppRolesEnum.ITEMSHIERARCHYVIEWER,
      AppRolesEnum.ITEMSHIERARCHYEDITOR,
      AppRolesEnum.ITEMSHIERARCHYADMIN,
    ],
    links: [
      {
        label: 'Global Hierarchies',
        routerLink: '/FnB-MDH/global-hierarchies'
      },
      {
        label: 'User Guide',
        userGuide: AppModulesEnum.FNB
      },
    ],
  },
  {
    module: 'Global Leavers Report',
    requiredRoles: [
      AppRolesEnum.LEAVERS_ADMIN,
      AppRolesEnum.LEAVERS_ICFR_CONTROL_OWNER,
      AppRolesEnum.LEAVERS_STAKEHOLDER,
    ],
    links: [
      {
        label: 'User Guide',
        userGuide: AppModulesEnum.LEAVERS
      },
    ],
  },
];
