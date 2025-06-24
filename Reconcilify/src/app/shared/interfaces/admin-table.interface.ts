export interface IAdmin {
  id?: number;
  name: string;
  isActive: boolean;
  createdDate?: string;
  createdBy?: string;
  lastUpdatedDate?: string;
  lastUpdatedBy?: string;

  isEditing?: boolean;
}
