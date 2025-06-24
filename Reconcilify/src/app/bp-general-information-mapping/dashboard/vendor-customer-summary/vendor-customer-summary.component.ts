import { Component, OnInit } from '@angular/core';
import { vendorCustomerOrigin } from '../../../shared/constants/vendor-customer-origin.constant';
import { vendorCustomerStatus } from '../../../shared/constants/vendor-customer-status.constant';
import { NavigationExtras, Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IVendorCustomerSummary } from './models/vendor-customer-summary.interface';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-vendor-customer-summary',
  templateUrl: './vendor-customer-summary.component.html',
  styleUrl: './vendor-customer-summary.component.scss',
  standalone: false
})
export class VendorCustomerSummaryComponent implements OnInit {
  vcOrigin = vendorCustomerOrigin;
  vcStatus = vendorCustomerStatus;
  summaryData: IVendorCustomerSummary[] = [];
  totalVendorCustomersCfin: number = 0;

  constructor(
    private readonly router: Router,
    private readonly dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.getSummaryData();
    this.dashboardService.uploadFinished
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.getSummaryData();
      });
  }

  getSummaryData(): void {
    this.dashboardService
      .getSummaryData()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.summaryData = data
          .map((row: IVendorCustomerSummary) => {
            if (row.status === this.vcStatus.total) {
              this.totalVendorCustomersCfin =
                row.originLevelAggregations?.[this.vcStatus.total] ?? 0;
            }
            return {
              status: row.status,
              sapCorp: row.originLevelAggregations?.[this.vcOrigin.sapCorp] ?? 0,
              sapGamma: row.originLevelAggregations?.[this.vcOrigin.sapGamma] ?? 0,
              sapAmica: row.originLevelAggregations?.[this.vcOrigin.sapAmica] ?? 0,
              peopleSoft: row.originLevelAggregations?.[this.vcOrigin.peopleSoft] ?? 0,
            };
          })
          .sort(this.sortByStatus);
        this.summaryData = this.summaryData.filter(
          (row: IVendorCustomerSummary) => row.status !== this.vcStatus.total
        );
      });
  }

  redirectToCentralRepository(
    row?: IVendorCustomerSummary,
    origin?: string
  ): void {
    let queryParams = {};
    if (origin && row?.status) {
      queryParams = { origin: origin, status: row?.status };
    } else {
      queryParams = { status: this.vcStatus.total };
    }
    const navExtras: NavigationExtras = {
      queryParams: queryParams,
      replaceUrl: true,
    };

    this.router.navigate(['/vcm/central-repository'], navExtras);
  }

  sortByStatus = (
    a: IVendorCustomerSummary,
    b: IVendorCustomerSummary
  ): number => {
    const statusOrder = [
      this.vcStatus.mapped,
      this.vcStatus.new,
      this.vcStatus.approved,
    ];
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  };
}
