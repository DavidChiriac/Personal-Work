import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CentralRepositoryService } from '../../central-repository.service';
import { IVendor } from '../../../../shared/interfaces/Vendor.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { concatMap, map, of, take } from 'rxjs';
import { vendorCustomerStatus } from '../../../../shared/constants/vendor-customer-status.constant';
import { SessionStorageService } from 'ngx-webstorage';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-actions-section',
  templateUrl: './actions-section.component.html',
  styleUrl: './actions-section.component.scss',
  standalone: false
})
export class ActionsSectionComponent implements OnInit {
  @Output() approved = new EventEmitter<void>();
  @Output() nextPreviousIds = new EventEmitter<{next: string | undefined, previous: string | undefined}>();
  @Output() isLoading = new EventEmitter<boolean>();
  @Input() emptyFilters = true;
  @Input() editMode = false;
  @Input() currentRecord!: IVendor;
  @Input() validCfin = false;

  vcStatus = vendorCustomerStatus;

  nextRecord: string | undefined = undefined;
  previousRecord: string | undefined = undefined;

  currentRecordIndexInList!: number;
  totalNumberOfRecordsInList!: number;

  constructor(
    private readonly centralRepositoryService: CentralRepositoryService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ssService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        concatMap((params) => {
          const obj = this.ssService.retrieve('filters');
          const field = obj.fieldToSort || 'status';
         
          const entries = Object.entries(this.currentRecord);

          let currentValue = '';

          entries.forEach(([key, value]) => {
            if(key === field) {
              currentValue = value as string;
            }
          });
          
          const getNextRecord$ = this.centralRepositoryService.getNextRecord(
            params['id'], currentValue
          );

          const next = this.ssService.retrieve('nextRecordForApproved');
          const previous = this.ssService.retrieve('previousRecordForApproved');

          if(!next && !previous) {
            return getNextRecord$.pipe(
              concatMap((next) => {
                const getPreviousRecord$ = this.centralRepositoryService.getPreviousRecord(params['id'], currentValue);
                return getPreviousRecord$.pipe(
                  map((previous) => {
                    return { nextRecord: next, previousRecord: previous };
                  })
                );
              })
            );
          }
          return of({nextRecord: next, previousRecord: previous});
        }),
        untilDestroyed(this),
        take(1)
      )
      .subscribe((records) => {
        this.nextRecord = records.nextRecord;
        this.previousRecord = records.previousRecord;
        this.nextPreviousIds.emit({next: this.nextRecord, previous: this.previousRecord});
      });

    this.currentRecordIndexInList = this.ssService.retrieve('currentRecordIndex');
    this.totalNumberOfRecordsInList = this.ssService.retrieve('totalNumberOfRecords');
  }

  approve(): void {
    this.approved.emit();
  }

  closeRecordView(): void{
    this.ssService.store('recordViewClosed', true);
    this.router.navigate(['../..'], {relativeTo: this.route});
  }

  goToPreviousRecord(): void {
    this.ssService.store('currentRecordIndex', this.currentRecordIndexInList - 1);
    this.ssService.clear('nextRecordForApproved');
    this.ssService.clear('previousRecordForApproved');
    this.isLoading.emit(true);
    this.router.navigate(['../', this.previousRecord], {
      relativeTo: this.route,
    });
  }

  goToNextRecord(): void {
    this.ssService.store('currentRecordIndex', this.currentRecordIndexInList + 1);
    this.ssService.clear('nextRecordForApproved');
    this.ssService.clear('previousRecordForApproved');
    this.isLoading.emit(true);
    this.router.navigate(['../', this.nextRecord], {
      relativeTo: this.route,
    });
  }

  clearFilters(): void {
    this.centralRepositoryService.recordViewClearFilters.emit();
  }
}
