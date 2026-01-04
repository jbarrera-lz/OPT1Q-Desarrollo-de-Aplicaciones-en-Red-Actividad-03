import { ResolveFn  } from '@angular/router';
import { PetrolStationsService } from '../services/petrol-stations-service';
import { PetrolStations } from '../common/petrolStation';
import { inject } from '@angular/core';

export const petrolStationResolver: ResolveFn<PetrolStations | null> = (
  
) => {
  console.log('Resolver returning petrol stations from PetrolStationsService.');
  return inject(PetrolStationsService).getPetrolStations();
};
