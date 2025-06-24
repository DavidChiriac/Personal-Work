import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DistributionChartComponent } from './distribution-chart.component';
import { Chart } from 'chart.js';

jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
    plugins: {
      datalabels: jest.fn(),
    },
  },
  registerables: [],
}));

describe('DistributionChartComponent', () => {
  let component: DistributionChartComponent;
  let fixture: ComponentFixture<DistributionChartComponent>;

  beforeAll(() => {
    global.getComputedStyle = jest.fn().mockReturnValue({
      getPropertyValue: (property: string) => {
        switch (property) {
        case '--green-lime-200':
          return '#A8E6CF';
        case '--green-lime-400':
          return '#56C596';
        case '--green-lime-600':
          return '#2F9E7D';
        case '--green-lime-800':
          return '#1A6A56';
        case '--gray-night-900':
          return '#2C2C2C';
        case '--avolta-white':
          return '#FFFFFF';
        default:
          return '';
        }
      },
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DistributionChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DistributionChartComponent);
    component = fixture.componentInstance;
  });

  it('should initialize chart colors from getComputedStyle in ngOnInit', () => {
    fixture.detectChanges();

    expect(component.chartColors.length).toBe(4);
    expect(component.chartColors[0].background).toBe('#A8E6CF');
    expect(component.chartColors[1].background).toBe('#56C596');
    expect(component.chartColors[2].background).toBe('#2F9E7D');
    expect(component.chartColors[3].background).toBe('#1A6A56');
  });

  it('should call Chart.register during ngOnInit', () => {
    const registerSpy = jest.spyOn(Chart, 'register');

    fixture.detectChanges();

    expect(registerSpy).toHaveBeenCalled();
  });

  it('should register the custom plugin in ngOnInit', () => {
    const registerSpy = jest.spyOn(Chart, 'register');

    fixture.detectChanges();

    expect(registerSpy).toHaveBeenCalledWith(expect.anything());
  });

  it('should process chart data correctly when ngOnChanges is called', () => {
    component.chartData = [
      {
        label: 'Test Label',
        incorrectClassification: 20,
        missingClassificationLevel: 30,
        totalProducts: 50,
      },
    ];

    component.ngOnInit();
    component.ngOnChanges();

    expect(component.proccessedChartData).toBeTruthy();
    expect(component.proccessedChartData.labels.length).toBe(3);
    expect(component.proccessedChartData.datasets.length).toBe(1);
  });

  it('should normalize data correctly', () => {
    const data = [10, 20, 30];
    const normalized = component.normalizeData(data);

    expect(normalized).toEqual([17, 33, 50]);
  });
});
