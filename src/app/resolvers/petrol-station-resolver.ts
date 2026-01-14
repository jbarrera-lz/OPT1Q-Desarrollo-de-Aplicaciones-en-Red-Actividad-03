import { ResolveFn  } from '@angular/router';
import { PetrolStationsService } from '../services/petrol-stations-service';
import { EstacionTerrestre } from '../common/estacion-terrestre';
import { inject } from '@angular/core';

export const petrolStationResolver: ResolveFn<EstacionTerrestre[]> = () => {
  console.log('Resolver returning petrol stations from PetrolStationsService.');
  return inject(PetrolStationsService).getPetrolStationsFromURL();
};
