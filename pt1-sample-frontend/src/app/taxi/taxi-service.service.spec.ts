import { TestBed } from '@angular/core/testing';

import { TaxiServiceService } from './taxi-service.service';

describe('TaxiServiceService', () => {
  let service: TaxiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
