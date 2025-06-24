export interface IGroupModuleDTO {
  [key: string]: any;

  id?: number;
  groupId?: number;
  groupName?: string;
  adGroupId?: string;
  group?: {id: number, name: string};
  moduleId?: number;
  moduleName?: string;
  module?: {id: number, name: string};
  isActive?: boolean;
  createdOn?: string | Date;
  createdBy?: string;
  lastUpdatedOn?: string | Date;
  lastUpdatedBy?: string;
}
