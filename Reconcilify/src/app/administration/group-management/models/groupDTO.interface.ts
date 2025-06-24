export interface IGroupDTO {
  [key: string]: any;

  id?: number;
  groupName: string;
  adGroupId?: string;
  isActive?: boolean;
  createdDate?: string | Date;
  createdDateTime?: string;
  createdBy?: string;
  lastUpdatedDate?: string | Date;
  lastUpdatedDateTime?: string;
  lastUpdatedBy?: string;

  isEditing?: boolean;
}
