import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IVendor } from '../../../../shared/interfaces/Vendor.interface';
import { CentralRepositoryService } from '../../central-repository.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IVendorDropdowns } from '../../../../shared/interfaces/VendorDropdowns.interface';
import { ICfinOptions } from '../../../../shared/interfaces/CfinOptions.interface';
import { Dropdown } from 'primeng/dropdown';
import { vendorCustomerStatus } from '../../../../shared/constants/vendor-customer-status.constant';
import { categoryStartCfin } from '../../../../shared/constants/category-start-cfin.constant';
import { DuplicatesTableColumns } from '../models/duplicates-table.columns';
import {
  IVendorCustomer,
  IVendorCustomerRequestParams,
} from '../../central-repository-table/models/central-repository-table.interface';
import { CentralRepositoryFilters } from '../../central-repository-table/models/central-repository-table-filters';
import { DatePipe } from '@angular/common';
import { TableMultiselectOption } from '../../../../shared/utils/table-filters-utils';
import { vendorCustomerMatching } from '../../../../shared/constants/vendor-customer-matching.constant';
import { SessionStorageService } from 'ngx-webstorage';

@UntilDestroy()
@Component({
  selector: 'app-duplicates-table',
  templateUrl: './duplicates-table.component.html',
  styleUrl: './duplicates-table.component.scss',
  providers: [DatePipe],
  standalone: false
})
export class DuplicatesTableComponent implements OnInit {
  @Output() isEditing = new EventEmitter<boolean>(false);
  @Output() isSaving = new EventEmitter<Partial<IVendor>>();
  @Output() approved = new EventEmitter<IVendor>();
  @Output() filtersAreEmpty = new EventEmitter<boolean>();
  @Output() cfinValidity = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @ViewChild('cfinSelection') cfinSelection!: Dropdown;

  @Input() currentRecord!: IVendor;
  @Input() tableData: IVendor[] = [];
  @Input() totalRecords = 0;
  tableFilters: CentralRepositoryFilters;
  emptyFilters = true;

  vcStatus = vendorCustomerStatus;
  vcMatching = vendorCustomerMatching;
  tableColumns = DuplicatesTableColumns.getColumns();

  cfinOptionsObject: ICfinOptions[] = [];
  cfinButtons: {
    label: string;
    startCode: number;
  }[] = [];
  cfinStart: number | null = null;

  dropdowns: IVendorDropdowns[] = [];
  categories: string[] = [];
  bpGroupes: string[] = [];
  accountGroupes: string[] = [];

  editMode = false;
  editedRecord!: IVendor;

  validCfin = true;
  validFirstCharacter: number = -1;

  loading = false;

  constructor(
    private readonly centralRepositoryService: CentralRepositoryService,
    private readonly datePipe: DatePipe,
    private readonly sessionStorageService: SessionStorageService
  ) {
    this.tableFilters = new CentralRepositoryFilters();
  }

  ngOnInit(): void {
    this.editedRecord = { ...this.currentRecord };
    const cfinOptions = this.sessionStorageService.retrieve('cfinOptions');

    if (cfinOptions) {
      this.cfinOptionsObject = cfinOptions;
      this.getCategories();
      this.validateCfin(true);
    } else {
      this.centralRepositoryService
        .getCfinOptions()
        .pipe(untilDestroyed(this))
        .subscribe((options: ICfinOptions[]) => {
          this.cfinOptionsObject = [...options];
          this.getCategories();
          this.validateCfin(true);
          this.sessionStorageService.store('cfinOptions', options);
        });
    }

    this.getTableFilters();
    this.checkIfFiltersAreEmpty();

    this.centralRepositoryService.recordViewClearFilters
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.tableFilters?.emptyFilters();
        this.searchWithFilters();
        this.filtersAreEmpty.emit(true);
      });
  }

  validateCfin(initialValidation = false): void {
    if (!this.editedRecord.cfinCode) {
      this.validCfin = false;
      return;
    }

    if (!initialValidation && !this.editMode) {
      this.currentRecord = { ...this.editedRecord };
      this.toggleEditMode();
    }

    Object.values(categoryStartCfin).forEach((category) => {
      if (this.editedRecord.category === category.name) {
        this.cfinStart = category.start;
        this.validFirstCharacter = category.start;
        if (
          !this.editedRecord.cfinCode ||
          this.editedRecord.cfinCode
            .toString()
            .startsWith(category.start.toString())
        ) {
          this.validCfin = true;
        } else {
          this.validCfin = false;
        }
      }
    });

    this.cfinValidity.emit(this.validCfin);
  }

  toggleEditMode(editMode: boolean = !this.editMode): void {
    this.editedRecord = { ...this.currentRecord };
    this.validateCfin(true);
    this.editMode = editMode;
    this.isEditing.emit(editMode);
  }

  saveChanges(): void {
    this.isSaving.emit({
      id: this.editedRecord.id,
      name1: this.editedRecord.name1,
      name2: this.editedRecord.name2,
      street: this.editedRecord.street,
      vatRegistrationNumber: this.editedRecord.vatRegistrationNumber,
      category: this.editedRecord.category,
      bpGrouping: this.editedRecord.bpGrouping,
      accountGroup: this.editedRecord.accountGroup,
      status: this.editedRecord.status,
      cfinCode: this.editedRecord.cfinCode,
      vatTaxComparable: this.editedRecord.vatTaxComparable
    });
  }

  saveAndApprove(): void {
    this.approved.emit(this.editedRecord);
    this.toggleEditMode();
  }

  hasPaginator(): boolean {
    return this.totalRecords > 20;
  }

  copyCfinCode(cfinCode: number): void {
    this.toggleEditMode(true);
    this.editedRecord.cfinCode = cfinCode;
    this.validateCfin(true);
  }

  getNewCfinCode(startCode?: number): void {
    if(!this.editMode) {
      this.toggleEditMode(true);
    }

    this.centralRepositoryService
      .getCfinCode(this.editedRecord.category, startCode)
      .pipe(untilDestroyed(this))
      .subscribe((code: number) => {
        this.editedRecord.cfinCode = code;
        this.validateCfin(true);
      });
    this.cfinSelection.hide();
  }

  onMultiselectSelectionChange(
    selectedItems: Partial<IVendorCustomer>[],
    field: string
  ): void {
    this.tableFilters[field] = selectedItems;

    this.searchWithFilters();
  }

  showOptions(): void {
    this.cfinSelection.show();
  }

  getCfinOptions(): void {
    this.cfinButtons = [];
    this.cfinOptionsObject.forEach((item: ICfinOptions) => {
      if (item.categoryName === this.editedRecord.category) {
        if (this.cfinStart) {
          this.cfinButtons = item.options.filter(
            (option) => option.startCode === this.cfinStart
          );
        } else {
          this.cfinButtons = item.options;
        }
      }
    });

    if (this.cfinButtons?.length === 0) {
      this.cfinOptionsObject.forEach((item: ICfinOptions) => {
        if (item.categoryName === 'other') {
          this.cfinButtons = item.options;
        }
      });
    }
  }

  getCategories(): void {
    const categoryGroupMatching = this.sessionStorageService.retrieve(
      'categoryGroupMatching'
    );
    if (categoryGroupMatching) {
      this.setDropdownsOptions(true, true);
    } else {
      this.centralRepositoryService
        .getCategoryGroupMatching()
        .pipe(untilDestroyed(this))
        .subscribe((categories: IVendor[]) => {
          this.accountGroupes = [];
          this.bpGroupes = [];
          categories.forEach((record: IVendor) => {
            if (!this.categories.includes(record.category)) {
              this.categories.push(record.category?.trim());
            }
          });
          this.sessionStorageService.store('categoryGroupMatching', categories);
          this.setDropdownsOptions(true, true);
        });
    }
  }

  // eslint-disable-next-line max-lines-per-function
  setDropdownsOptions(
    bpGroupingSelected?: boolean,
    accountGroupSelected?: boolean
  ): void {
    this.validateCfin(true);
    if (bpGroupingSelected) {
      this.editedRecord.accountGroup = '';
    }
    if (accountGroupSelected) {
      this.editedRecord.bpGrouping = '';
    }

    const categories = this.sessionStorageService.retrieve(
      'categoryGroupMatching'
    );
    const category = categories.filter((record: { category: string }) => {
      if (!this.categories.includes(record.category)) {
        this.categories.push(record.category);
      }
      return record.category === this.editedRecord.category;
    });

    if (bpGroupingSelected && accountGroupSelected) {
      this.accountGroupes = [];
      this.bpGroupes = [];

      category.forEach(
        (record: {
          category: string;
          bpGrouping: string;
          accountGroup: string;
          cfinStart: number | null;
        }) => {
          if (!this.accountGroupes.includes(record.accountGroup)) {
            this.accountGroupes.push(record.accountGroup);
          }
          if (!this.bpGroupes.includes(record.bpGrouping)) {
            this.bpGroupes.push(record.bpGrouping);
          }
        }
      );

      this.cfinStart = category[0]?.cfinStart;

      if (
        !this.bpGroupes.includes(this.editedRecord.bpGrouping) &&
        this.editedRecord.category
      ) {
        this.editedRecord.bpGrouping = this.bpGroupes[0];
      }
      if (
        !this.accountGroupes.includes(this.editedRecord.accountGroup) &&
        this.editedRecord.category
      ) {
        this.editedRecord.accountGroup = this.accountGroupes[0];
      }
    } else 
      if (bpGroupingSelected) {
        const filteredRecord = category.filter(
          (record: {
            accountGroup: string;
            bpGrouping: string;
            cfinStart: number | null;
          }) => record.bpGrouping === this.editedRecord.bpGrouping
        )[0];
        this.editedRecord.accountGroup = filteredRecord?.accountGroup;
        this.cfinStart = filteredRecord?.cfinStart;
      } else 
        if (accountGroupSelected) {
          const filteredRecord = category.filter(
            (record: { accountGroup: string; bpGrouping: string }) =>
              record.accountGroup === this.editedRecord.accountGroup
          )[0];
          this.editedRecord.bpGrouping = filteredRecord?.bpGrouping;
          this.cfinStart = filteredRecord?.cfinStart;
        } else {
          this.cfinStart = null;
        }

    this.getCfinOptions();
  }

  searchWithFilters(): void {
    this.checkIfFiltersAreEmpty();
    this.isLoading.emit(true);

    const params: Partial<IVendorCustomerRequestParams & CentralRepositoryFilters>= {
      ...this.tableFilters,
      statuses: this.tableFilters?.selectedStatus?.map((item: TableMultiselectOption) => item.value),
      origins: this.tableFilters?.selectedOrigin?.map((item: TableMultiselectOption) => item.value),
      vendorCodes: this.tableFilters?.selectedVendor?.map((item: TableMultiselectOption) => item.value),
      customerCodes: this.tableFilters?.selectedCustomer?.map((item: TableMultiselectOption) => item.value),
      categories: this.tableFilters?.selectedCategory?.map((item: TableMultiselectOption) => item.value),
      bpGroupings: this.tableFilters?.selectedBpGrouping?.map((item: TableMultiselectOption) => item.value),
      accountGroups: this.tableFilters?.selectedAccountGroup?.map((item: TableMultiselectOption) => item.value),
      oneTimeAccounts: this.tableFilters?.selectedOneTimeAcc?.map((item: TableMultiselectOption) => item.value),
      retrievedOn: this.formatDateFilters(this.tableFilters?.retrievedOn),
      exportedOn: this.formatDateFilters(this.tableFilters?.exportedOn),
      updatedOn: this.formatDateFilters(this.tableFilters?.updatedOn),
    };

    delete params.accountGroup;
    delete params.bpGrouping;
    delete params.status;
    delete params.matching;
    delete params.origin;
    delete params.vendor;
    delete params.customer;
    delete params.oneTimeAcc;
    delete params.category;

    delete params.selectedAccountGroup;
    delete params.selectedBpGrouping;
    delete params.selectedStatus;
    delete params.selectedMatching;
    delete params.selectedOrigin;
    delete params.selectedVendor;
    delete params.selectedCustomer;
    delete params.selectedOneTimeAcc;
    delete params.selectedCategory;

    this.centralRepositoryService
      .getDuplicates(this.currentRecord?.id, params)
      ?.pipe(untilDestroyed(this))
      .subscribe({
        next: (duplicates) => {
          this.isLoading.emit(false);
          this.tableData = duplicates ? [...duplicates] : [];
          this.totalRecords = this.tableData.length;

          this.tableData.forEach((row: IVendor) => {
            row.retrievedOn = this.formatDateFilters(row.retrievedOn);
            row.exportedOn = this.formatDateFilters(row.exportedOn);
            row.updatedOn = this.formatDateFilters(row.updatedOn);
          });
        },
        error: () => {
          this.isLoading.emit(false);
          this.tableData = [];
          this.totalRecords = 0;
        },
      });
  }

  formatDateFilters(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }

  getTableFilters(): void {
    const filters = this.sessionStorageService.retrieve('filtersOptions');
    if (!filters) {
      this.centralRepositoryService
        .getVendorCustomerDataFilters()
        .pipe(untilDestroyed(this))
        .subscribe((data: Partial<IVendorCustomerRequestParams>) => {
          this.tableFilters = this.centralRepositoryService.createFilters(
            data as CentralRepositoryFilters
          );
        });
    } else {
      this.tableFilters = this.centralRepositoryService.createFilters(
        filters as CentralRepositoryFilters
      );
    }
  }

  checkIfFiltersAreEmpty(): void {
    this.emptyFilters = this.tableFilters?.checkIfFiltersAreEmpty();
    this.filtersAreEmpty.emit(this.emptyFilters);
  }
}
