import { TestBed } from '@angular/core/testing';

import { PetrolStationsService } from './petrol-stations-service';

describe('PetrolStationsService', () => {
  let service: PetrolStationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetrolStationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
