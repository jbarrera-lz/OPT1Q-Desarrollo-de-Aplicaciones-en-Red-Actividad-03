import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { PetrolStationsService } from '../services/petrol-stations-service';
import { CurrentLocation } from '../common/current-location';

export const getLocationResolver: ResolveFn<CurrentLocation> = () => {
  console.log('Resolver returning coords from PetrolStationsService.');
  return inject(PetrolStationsService).getCurrentCoordenates();
};
