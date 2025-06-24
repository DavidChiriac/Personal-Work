import { AppRolesEnum } from '../utils/app-roles';

export interface IUser {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  createdOn: string;
  roleNames: AppRolesEnum[];
}
