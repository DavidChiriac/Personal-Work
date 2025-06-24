export interface IGroupSourceSystemMappingDTO {
  id?: number;
  groupId?: number;
  group?: {id: number, name: string};
  sourceSystemId?: number;
  sourceSystem?: {id: number, name: string};
  isActive?: boolean;
  createdDate?: string;
  createdBy?: string;
  lastUpdatedDate?: string;
  lastUpdatedBy?: string;
}
