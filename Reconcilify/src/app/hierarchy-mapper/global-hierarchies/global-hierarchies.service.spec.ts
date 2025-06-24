import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { GlobalHierarchiesService } from './global-hierarchies.service';
import { IGlobalHierarchies } from './models/global-hierarchies.interface';
import { HttpResponse } from '@angular/common/http';
import { TestingModule } from '../../shared/testing.module';

describe('GlobalHierarchiesService', () => {
  let service: GlobalHierarchiesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [GlobalHierarchiesService],
    });
    service = TestBed.inject(GlobalHierarchiesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('#getGlobalHierarchies', () => {
    it('should retrieve global hierarchies data', () => {
      const mockData: IGlobalHierarchies[] = [
        {
          id: 1,
          globalCategoryName: '1',
          globalCategoryCode: '1',
          globalGroupName: '11',
          globalGroupCode: '11',
          globalSubgroupName: '111',
          globalSubgroupCode: '111',
        },
        {
          id: 2,
          globalCategoryName: '1',
          globalCategoryCode: '1',
          globalGroupName: '12',
          globalGroupCode: '12',
          globalSubgroupName: '121',
          globalSubgroupCode: '121',
        },
      ];

      service.getGlobalHierarchies().subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(service.apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('#exportTableData', () => {
    it('should export table data and return a Blob', () => {
      const mockFilters = {
        selectedCategory: [{ name: 'Category 1', code: 'C1' }],
        selectedGroup: [{ name: 'Group 1', code: 'G1' }],
        selectedSubgroup: [{ name: 'Subgroup 1', code: 'S1' }]
      };
      const mockResponse = new Blob();

      service.exportTableData(mockFilters).subscribe(response => {
        expect(response.body).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(service.apiUrl + '/export');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        globalCategoryName: ['Category 1'],
        globalCategoryCode: ['C1'],
        globalGroupName: ['Group 1'],
        globalGroupCode: ['G1'],
        globalSubgroupName: ['Subgroup 1'],
        globalSubgroupCode: ['S1']
      });
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.event(new HttpResponse({ body: mockResponse }));
    });
  });
});
