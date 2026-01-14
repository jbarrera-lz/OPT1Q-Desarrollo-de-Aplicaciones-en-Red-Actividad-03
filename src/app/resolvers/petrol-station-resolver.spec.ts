import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { petrolStationResolver } from './petrol-station-resolver';

describe('petrolStationResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => petrolStationResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
