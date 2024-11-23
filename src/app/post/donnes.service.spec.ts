import { TestBed } from '@angular/core/testing';

import { DonnesService } from './donnes.service';

describe('DonnesService', () => {
  let service: DonnesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonnesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
