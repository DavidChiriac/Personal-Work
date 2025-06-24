import { IColumn } from '../interfaces/column.interface';

const commonColumns: Record<string, IColumn> = {
  edit: { field: 'edit', header: '' },
  selection: { field: 'selection', header: '' },
  groupName: { field: 'groupName', header: 'Group Name', style: { 'min-width': '12rem', 'max-width': '12rem'}, filterable: true },
  email: { field: 'email', header: 'User Email', style: { 'min-width': '12rem', 'max-width': '12rem'}, filterable: true },
  firstName: { field: 'firstName', header: 'First Name', filterable: true },
  lastName: { field: 'lastName', header: 'Last Name', filterable: true },
  createdDate: { field: 'createdDate', header: 'Created', datepicker: true, filterable: true, dateRange: true },
  createdBy: { field: 'createdBy', header: 'Created by', filterable: true },
  lastUpdatedOn: { field: 'lastUpdatedOn', header: 'Last Updated', datepicker: true, filterable: true, dateRange: true },
  lastUpdatedDate: { field: 'lastUpdatedDate', header: 'Last Updated', datepicker: true, filterable: true, dateRange: true },
  lastUpdatedBy: { field: 'lastUpdatedBy', header: 'Last Updated by', filterable: true },
  status: { field: 'status', header: 'Status', sortableField: 'isActive', filterable: true, filterMultiselect: true },
  sourceSystem: { field: 'sourceSystem', header: 'Source System', style: { 'min-width': '12rem', 'max-width': '12rem'}, filterable: true, filterMultiselect: true },
  module: { field: 'module', header: 'Module', style: { 'min-width': '12rem', 'max-width': '12rem'}, filterable: true, filterMultiselect: true },
};

export class GroupManagementColumns {
  static getColumns(): IColumn[] {
    return [
      commonColumns['edit'],
      commonColumns['groupName'],
      { field: 'adGroupId', header: 'AD Group ID', style: { 'min-width': '15rem', 'max-width': '15rem'}, filterable: true },
      commonColumns['createdDate'],
      commonColumns['createdBy'],
      commonColumns['lastUpdatedDate'],
      commonColumns['lastUpdatedBy'],
      commonColumns['status'],
    ];
  }
}

export class GroupModuleManagementColumns {
  static getColumns(): IColumn[] {
    return [
      commonColumns['edit'],
      commonColumns['groupName'],
      commonColumns['module'],
      { field: 'createdOn', header: 'Assigned', filterable: true, datepicker: true, dateRange: true  },
      { field: 'createdBy', header: 'Assigned by', filterable: true },
      commonColumns['lastUpdatedOn'],
      commonColumns['lastUpdatedBy'],
      commonColumns['status'],
    ];
  }
}

export class UserGroupManagementColumns {
  static getColumns(): IColumn[] {
    return [
      commonColumns['selection'],
      commonColumns['edit'],
      {...commonColumns['groupName'], sortableField: 'groupEntity.groupName', filterMultiselect: true },
      {...commonColumns['email'], sortableField: 'userEmail'},
      {...commonColumns['firstName'], sortableField: 'userFirstName'},
      {...commonColumns['lastName'], sortableField: 'userLastName'},
      { field: 'createdOn', header: 'Assigned', sortableField: 'auditMetadata.createdOn', datepicker: true, dateRange: true, filterable: true, dynamicDateSelection: true},
      { field: 'createdBy', header: 'Assigned by', sortableField: 'auditMetadata.createdBy', filterable: true},
      {...commonColumns['lastUpdatedOn'], sortableField: 'auditMetadata.lastUpdatedOn', dynamicDateSelection: true},
      {...commonColumns['lastUpdatedBy'], sortableField: 'auditMetadata.lastUpdatedBy'},
      commonColumns['status'],
    ];
  }
}
