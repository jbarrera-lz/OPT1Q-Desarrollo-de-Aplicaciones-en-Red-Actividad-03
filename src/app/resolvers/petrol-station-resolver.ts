import { ActivatedRouteSnapshot, ResolveFn, Route, RouterState, RouterStateSnapshot } from '@angular/router';
import { PetrolStationsService } from '../services/petrol-stations-service';
import { PetrolStations } from '../common/petrolStation';
import { inject } from '@angular/core';

export const petrolStationResolver: ResolveFn<PetrolStations | null> = (
  
) => {
  return inject(PetrolStationsService).getPetrolStations();
};
