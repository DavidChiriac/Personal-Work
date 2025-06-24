import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IColumn } from '../../interfaces/column.interface';
import { IGroupDTO } from '../../../administration/group-management/models/groupDTO.interface';
import { IGroupModuleDTO } from '../../../administration/group-module-management/models/groupModuleDTO.interface';
import { IUserGroupDTO } from '../../../administration/user-group-management/models/userGroupDTO.interface';

@Component({
  selector: 'app-table-cell',
  templateUrl: './table-cell.component.html',
  styleUrl: './table-cell.component.scss',
  standalone: false
})
export class TableCellComponent {
  @Input() col: IColumn = {field: '', header: ''};
  @Input() index!: number;
  @Input() editMode = false;
  @Input() canSave = false;
  @Input() disabled = false;
  @Input() canClickInactive = true;
  @Input() row!: IGroupDTO | IGroupModuleDTO | IUserGroupDTO;
  @Output() enterEditMode = new EventEmitter();
  @Output() exitEditMode = new EventEmitter();
  @Output() createMapping = new EventEmitter();
  @Output() showStatusChangeModal = new EventEmitter<{index: number, status: boolean}>();

  enterEditModeTrigger(): void {
    this.enterEditMode.emit();
  }

  exitEditModeTrigger(): void {
    this.exitEditMode.emit();
  }

  createMappingTrigger(): void {
    this.createMapping.emit();
  }

  showStatusChangeModalTrigger(index: number, status: boolean): void {
    this.showStatusChangeModal.emit({index: index, status: status});
  }
}
