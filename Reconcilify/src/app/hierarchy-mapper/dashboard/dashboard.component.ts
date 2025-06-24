import { Component, OnInit } from '@angular/core';
import { ISystemMetrics } from '../models/system-metrics.interface';
import { FnBDashboardService } from './dashboard.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false
})
export class FnBDashboardComponent implements OnInit {
  data!: ISystemMetrics[];
  totalData: ISystemMetrics = {
    systemCode: 0,
    totalProductsNumber: 0,
    totalClassificationIssues: 0,
    totalCorrectlyClassified: 0,
    missingClassification: 0,
    incorrectClassification: 0,
  };

  chartData: {
    label: string;
    totalProducts: number;
    missingClassificationLevel: number;
    incorrectClassification: number;
  }[] = [];

  chartData$!: Observable<
    {
      label: string;
      totalProducts: number;
      missingClassificationLevel: number;
      incorrectClassification: number;
    }[]
  >;

  constructor(
    private readonly dashboardService: FnBDashboardService
  ) {}

  ngOnInit(): void {
    this.dashboardService
      .getDashboardData()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (systemMetrics: { systemMetrics: ISystemMetrics[] }) => {
          this.data = systemMetrics.systemMetrics;
          this.processData();
        },
      });
  }

  processData(): void {
    this.data = this.data.map((systemMetrics: ISystemMetrics) => {
      this.totalData.totalProductsNumber += systemMetrics.totalProductsNumber;
      this.totalData.totalClassificationIssues += systemMetrics.totalClassificationIssues;
      this.totalData.totalCorrectlyClassified += systemMetrics.totalCorrectlyClassified;
      this.totalData.missingClassification += systemMetrics.missingClassification;
      this.totalData.incorrectClassification += systemMetrics.incorrectClassification;

      this.chartData.push({
        label: systemMetrics?.systemName ?? '',
        totalProducts: systemMetrics?.totalProductsNumber,
        missingClassificationLevel: systemMetrics?.missingClassification,
        incorrectClassification: systemMetrics?.incorrectClassification,
      });

      systemMetrics.classificationStatusComplianceScore = Math.trunc(
        (100 *
          systemMetrics.totalCorrectlyClassified) /
          systemMetrics.totalProductsNumber
      );

      return systemMetrics;
    });

    this.chartData$ = of(this.chartData);

    this.totalData.systemCode = -1;
    this.totalData.systemName = 'Total Products';

    this.totalData.classificationStatusComplianceScore = Math.trunc(
      (100 *
        this.totalData.totalCorrectlyClassified /
        this.totalData.totalProductsNumber)
    );
  }
}
