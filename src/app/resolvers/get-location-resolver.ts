import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { GetLocationService } from '../services/get-location-service';
import { Coordenates } from '../common/coordenates';

export const getLocationResolver: ResolveFn<Coordenates | null> = (

) => {
  console.log('Resolver returning coords from GetLocationService.');
  return inject(GetLocationService).getMyLocation();
};
