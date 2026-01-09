import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PetrolStations } from '../common/petrolStation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PetrolStationsService {
  private readonly apiUrl: string = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres`;
  
  constructor(private httpClient: HttpClient) { }

  /*------------------------------------*/
  /* Public Methods
  /*------------------------------------*/
  public getPetrolStations(): Observable<PetrolStations> {
    return this.httpClient.get<PetrolStations>(this.apiUrl);
  }
}
