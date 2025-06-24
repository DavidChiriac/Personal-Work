import { TestBed } from '@angular/core/testing';
import { SessionStorageService } from 'ngx-webstorage';
import { MockService } from 'ng-mocks';
import { TimedSessionStorageService } from '../timed-session-storage.service';

const mockSessionStorageService = MockService(SessionStorageService, {
  store: jest.fn(),
  retrieve: jest.fn(),
  clear: jest.fn(),
});

describe('TimedSessionStorageService', () => {
  let service: TimedSessionStorageService;
  let sessionStorageMock: jest.Mocked<SessionStorageService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TimedSessionStorageService,
        { provide: SessionStorageService, useValue: mockSessionStorageService },
      ],
    });

    service = TestBed.inject(TimedSessionStorageService);
    sessionStorageMock = TestBed.inject(SessionStorageService) as jest.Mocked<SessionStorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store an item with expiration time', () => {
    const key = 'testKey';
    const value = { message: 'Hello' };
    const ttl = 5000;
    const currentTime = 100000; // Mocked current time
    const expectedExpiresAt = currentTime + ttl * 60 * 1000;

    jest.spyOn(Date.prototype, 'getTime').mockImplementation(() => currentTime); // Mock Date.now()

    service.setItem(key, value, ttl);

    expect(sessionStorageMock.store).toHaveBeenCalledWith(key, {
      value,
      expiresAt: expectedExpiresAt,
    });
  });

  it('should retrieve an unexpired item', () => {
    const key = 'testKey';
    const value = { message: 'Hello' };
    const expiresAt = new Date().getTime() + 5000;

    sessionStorageMock.retrieve.mockReturnValue({ value, expiresAt });

    const result = service.getItem(key);

    expect(result).toEqual(value);
    expect(sessionStorageMock.retrieve).toHaveBeenCalledWith(key);
  });

  it('should return null for an expired item and clear it', () => {
    const key = 'testKey';
    const value = { message: 'Hello' };
    const expiredTime = new Date().getTime() - 5000; // Expired time

    jest.spyOn(sessionStorageMock, 'retrieve').mockReturnValue({ value, expiresAt: expiredTime });

    const result = service.getItem(key);

    expect(result).toBeNull();
    expect(sessionStorageMock.clear).toHaveBeenCalledWith(key);
  });

  it('should return null for a non-existent item', () => {
    const key = 'nonExistentKey';

    sessionStorageMock.retrieve.mockReturnValue(null);

    const result = service.getItem(key);

    expect(result).toBeNull();
    expect(sessionStorageMock.retrieve).toHaveBeenCalledWith(key);
  });

  it('should remove an item from storage', () => {
    const key = 'testKey';

    service.removeItem(key);

    expect(sessionStorageMock.clear).toHaveBeenCalledWith(key);
  });
});
