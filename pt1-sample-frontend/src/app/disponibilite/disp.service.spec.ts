import { TestBed } from '@angular/core/testing';

import { DispService } from './disp.service';

describe('DispService', () => {
  let service: DispService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
