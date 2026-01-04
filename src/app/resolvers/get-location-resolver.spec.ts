import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { getLocationResolver } from './get-location-resolver';

describe('getLocationResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => getLocationResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
