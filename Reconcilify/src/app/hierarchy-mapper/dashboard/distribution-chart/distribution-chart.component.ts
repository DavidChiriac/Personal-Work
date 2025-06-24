import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-distribution-chart',
  templateUrl: './distribution-chart.component.html',
  styleUrl: './distribution-chart.component.scss',
  standalone: false
})
export class DistributionChartComponent implements OnChanges, OnInit {
  @Input() chartData:
    | {
        label: string;
        incorrectClassification: number;
        missingClassificationLevel: number;
        totalProducts: number;
      }[]
    | null = null;

  plugin = ChartDataLabels;

  proccessedChartData: any;
  chartOptions: any;

  assortmentDistribution: number[] = [];
  missingClassificationLevel: number[] = [];
  incorrectClassification: number[] = [];

  chartColors: { background: string; font: string }[] = [];

  isEmpty = true;

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);

    this.chartColors = [
      {
        background: documentStyle.getPropertyValue('--green-lime-200'),
        font: documentStyle.getPropertyValue('--gray-night-900'),
      },
      {
        background: documentStyle.getPropertyValue('--green-lime-400'),
        font: documentStyle.getPropertyValue('--gray-night-900'),
      },
      {
        background: documentStyle.getPropertyValue('--green-lime-600'),
        font: documentStyle.getPropertyValue('--avolta-white'),
      },
      {
        background: documentStyle.getPropertyValue('--green-lime-800'),
        font: documentStyle.getPropertyValue('--avolta-white'),
      },
    ];

    Chart.register(...registerables);
    const leftAlignYAxisLabels = {
      id: 'leftAlignYAxisLabels',
      afterDraw: (chart: any): any => {
        const ctx = chart.ctx;
        const yAxis = chart.scales['y'];

        if (yAxis) {
          ctx.save();
          ctx.font = '16px AvoltaSans-Regular';

          yAxis.ticks.forEach((tick: any, index: number) => {
            const label = yAxis.getLabelForValue(tick.value);
            const yPos = yAxis.getPixelForTick(index);

            ctx.fillText(label, 0, yPos);
          });

          ctx.restore();
        }
      },
    };
    Chart.register(leftAlignYAxisLabels);
  }

  ngOnChanges(): void {
    this.chartData?.forEach((row) => {
      this.assortmentDistribution.push(row.totalProducts);
      this.missingClassificationLevel.push(row.missingClassificationLevel);
      this.incorrectClassification.push(row.incorrectClassification);
    });
    this.assortmentDistribution = this.normalizeData(
      this.assortmentDistribution
    );
    this.missingClassificationLevel = this.normalizeData(
      this.missingClassificationLevel
    );
    this.incorrectClassification = this.normalizeData(
      this.incorrectClassification
    );

    this.proccessedChartData = {
      labels: [
        'Assortment Distribution',
        'Missing Classification Level',
        'Incorrect Classification',
      ],
      datasets: this.chartData?.map((system, index) => {
        return {
          label: system.label,
          data: [this.assortmentDistribution[index], this.missingClassificationLevel[index], this.incorrectClassification[index]],
          backgroundColor: this.chartColors[index % 4].background,
          barThickness: 32,
          datalabels: {
            formatter: (value: number): string => {
              return value !== 0 ? value.toFixed(0) : '';
            },
            color: this.chartColors[index % 4].font,
            font: {
              size: 14,
            },
            padding: 6,
            align: 'center',
          },
        };
      }),
    };

    this.buildChartOptions();
  }

  buildChartOptions(): void {
    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          font: '12px AvoltaSans-Regular',
          labels: {
            boxWidth: 20,
            boxHeight: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any): string {
              return (
                tooltipItem.parsed.x.toFixed(0) +
                ' - ' +
                tooltipItem.dataset.label
              );
            },
          },
        },
      },
      layout: {
        padding: {
          left: 220,
        },
      },
      scales: {
        x: {
          stacked: true,
          max: 100,
          ticks: {
            callback: (): string => ``,
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          barPercentage: 1,
        },
      },
    };
  }

  normalizeData(data: number[]): number[] {
    const total = data.reduce((sum, value) => sum + value, 0);

    if (total === 0) {
      return new Array(data.length).fill(0);
    }

    const percentages = data.map(value => (value / total) * 100);

    const rounded = percentages.map(Math.floor);
    const roundedSum = rounded.reduce((sum, value) => sum + value, 0);

    const difference = 100 - roundedSum;

    const indices = percentages.map((value, index) => ({ index, decimal: value - Math.floor(value) })).sort((a, b) => b.decimal - a.decimal);

    for (let i = 0; i < difference; i+=1) {
      rounded[indices[i].index] += 1;
    }

    return rounded;
  }

}
