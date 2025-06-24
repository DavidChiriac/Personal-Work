import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { SharedServiceService } from '../shared.service';
import { environment } from '../../../../environments/environment';
import { UserGuideEnum } from '../../utils/user-guide-enum';

jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  DatePipe: jest.fn().mockImplementation(() => ({
    transform: jest.fn(),
  })),
}));

describe('SharedServiceService', () => {
  let service: SharedServiceService;
  let httpMock: jest.Mocked<HttpClient>;
  let datePipeMock: jest.Mocked<DatePipe>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
    } as any;

    datePipeMock = new DatePipe('en-US') as jest.Mocked<DatePipe>;
    service = new SharedServiceService(httpMock, datePipeMock);
  });

  it('should return app version', (done) => {
    const mockResponse = { app: { version: '1.2.3' } };
    httpMock.get.mockReturnValue(of(mockResponse));

    service.getAppVersion().subscribe((version) => {
      expect(version).toBe('Version 1.2.3');
      expect(httpMock.get).toHaveBeenCalledWith(
        `${environment.apiUrl}/management/info`
      );
      done();
    });
  });

  it('should open the user guide in a new tab', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    service.getReconUserGuide('Reconcilify');

    expect(openSpy).toHaveBeenCalledWith(
      `${environment.apiUrl}/api/docs/${UserGuideEnum.Reconcilify}`,
      '_blank'
    );

    openSpy.mockRestore();
  });

  it('should format the date using DatePipe', () => {
    datePipeMock.transform.mockReturnValue('2025-05-14');

    const result = service.formatDateFilters('2025-05-14T10:00:00Z');
    expect(result).toBe('2025-05-14');
    expect(datePipeMock.transform).toHaveBeenCalledWith(
      '2025-05-14T10:00:00Z',
      'yyyy-MM-dd'
    );
  });

  it('should get groups with module param', (done) => {
    const mockGroups = [{ id: 1, name: 'Admin' }];
    httpMock.get.mockReturnValue(of(mockGroups));

    service.getGroups('LEAVERS').subscribe((groups) => {
      expect(groups).toEqual(mockGroups);
      expect(httpMock.get).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/group-management/grid`,
        { params: expect.anything() }
      );
      done();
    });
  });

  it('should get groups without module param', (done) => {
    const mockGroups = [{ id: 2, name: 'Users' }];
    httpMock.get.mockReturnValue(of(mockGroups));

    service.getGroups().subscribe((groups) => {
      expect(groups).toEqual(mockGroups);
      expect(httpMock.get).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/group-management/grid`,
        { params: expect.anything() }
      );
      done();
    });
  });
});
