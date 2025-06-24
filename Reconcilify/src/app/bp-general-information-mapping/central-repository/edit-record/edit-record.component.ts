import { Component, OnInit } from '@angular/core';
import { CentralRepositoryService } from '../central-repository.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'ngx-webstorage';
import { vendorCustomerStatus } from '../../../shared/constants/vendor-customer-status.constant';
import { IVendor } from '../../../shared/interfaces/Vendor.interface';
import { vendorCustomerMatching } from '../../../shared/constants/vendor-customer-matching.constant';

@UntilDestroy()
@Component({
  selector: 'app-edit-record',
  templateUrl: './edit-record.component.html',
  styleUrl: './edit-record.component.scss',
  providers: [DatePipe],
  standalone: false
})
export class EditRecordComponent implements OnInit {
  vcStatus = vendorCustomerStatus;
  currentVendorId!: string;

  currentRecord!: IVendor;
  duplicates!: IVendor[];
  totalDuplicates!: number;

  editedRecord!: IVendor;
  approveModalVisible = false;
  approveComment: string = '';
  errorModalVisible = false;
  editMode = false;
  loading = true;
  emptyFilters = true;
  cfinIsValid = false;

  nextRecord: string | undefined;
  previousRecord: string | undefined;

  private readonly currentRecordSubject: BehaviorSubject<IVendor | null> = new BehaviorSubject<IVendor | null>(null);

  constructor(
    private readonly centralRepoService: CentralRepositoryService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly datePipe: DatePipe,
    private readonly ssService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      tap(params => this.currentVendorId = params['id']),
      switchMap(params => this.centralRepoService.getVendor(params['id']).pipe(
        catchError((error) => {
          // eslint-disable-next-line no-console
          console.log('Error fetching the record: ', error.message);
          this.router.navigate(['page-not-found'], {
            skipLocationChange: true,
          });
          return of(null);
        })
      )),
      untilDestroyed(this)
    ).subscribe((vendor) => {
      this.currentRecord = this.updateRecord(vendor || {} as IVendor);
      this.currentRecordSubject.next(this.currentRecord);
    });

    this.currentRecordSubject.pipe(
      switchMap(currentRecord => {
        if (!currentRecord) {
          return of(null);
        }
        this.loading = true;
        if(currentRecord.matching === vendorCustomerMatching.duplicate) {
          return this.centralRepoService.getDuplicates(this.currentVendorId).pipe(
            catchError((error) => {
              // eslint-disable-next-line no-console
              console.log('Error fetching the duplicate records: ', error.message);
              return of(null);
            })
          );
        }

        return of(null);
      }),
      untilDestroyed(this)
    ).subscribe((duplicates) => {
      this.loading = false;
      this.duplicates = duplicates ? [...duplicates] : [];
      this.totalDuplicates = this.duplicates.length;

      this.duplicates = this.duplicates.map((row: IVendor) => 
        this.updateRecord(row)
      );
    });
  }

  updateRecord(record: IVendor): IVendor {
    return {
      ...record,
      retrievedOn: this.formatDateFilters(record.retrievedOn),
      exportedOn: this.formatDateFilters(record.exportedOn),
      updatedOn: this.formatDateFilters(record.updatedOn)
    };
  }

  closeApproveModal(): void {
    this.approveModalVisible = false;
  }

  isLoading(event: boolean): void {
    this.loading = event;
  }

  showApproveDialog(record?: IVendor): void {
    this.approveModalVisible = true;
    if(record){
      this.editedRecord = {...record};
    }
  }

  saveChanges(event: Partial<IVendor>): void {
    this.loading = true;
    this.centralRepoService.saveChanges(event).pipe(untilDestroyed(this)).subscribe({
      next: (response: IVendor) => {
        this.currentRecord = this.updateRecord(response);
        this.currentRecordSubject.next(this.currentRecord);
        this.loading = false;
        this.editMode = false;
      },
      error: () => {
        this.toggleErrorModal();
        this.loading = false;
      }
    });
  }

  saveNextPreviousIds(event: {next: string | undefined, previous: string | undefined}): void {
    this.nextRecord = event.next;
    this.previousRecord = event.previous;
  }

  canApproveFunction(approve?: boolean): void {
    if (approve) {
      this.loading = true;
      this.ssService.store('nextRecordForApproved', this.nextRecord);
      this.ssService.store('previousRecordForApproved', this.previousRecord);
      this.centralRepoService
        .saveChanges({
          id: this.currentVendorId,
          name1: this.editedRecord?.name1 ?? this.currentRecord.name1,
          name2: this.editedRecord?.name2 ?? this.currentRecord.name2,
          street: this.editedRecord?.street ?? this.currentRecord.street,
          vatRegistrationNumber: this.editedRecord?.vatRegistrationNumber ?? this.currentRecord.vatRegistrationNumber,
          category: this.editedRecord?.category ?? this.currentRecord.category,
          bpGrouping: this.editedRecord?.bpGrouping ?? this.currentRecord.bpGrouping,
          accountGroup: this.editedRecord?.accountGroup ?? this.currentRecord.accountGroup,
          comment: this.approveComment,
          cfinCode: this.editedRecord?.cfinCode ?? this.currentRecord.cfinCode,
          status: this.vcStatus.approved,
        })
        ?.pipe(untilDestroyed(this))
        ?.subscribe({
          next: (result: IVendor) => {
            this.currentRecord = this.updateRecord(result);
            this.loading = false;
          },
          error: () => {
            this.toggleErrorModal();
            this.loading = false;
          },  
        });
      this.approveComment = '';
    }
    this.approveModalVisible = false;
  }

  getEditMode(isEditing: boolean): void {
    this.editMode = isEditing;
  }

  toggleErrorModal(): void {
    this.errorModalVisible = !this.errorModalVisible;
  }

  formatDateFilters(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }

  filtersAreEmpty(event: boolean): void{
    this.emptyFilters = event;
  }

  validateCfin(event: boolean): void {
    this.cfinIsValid = event;
  }
}
