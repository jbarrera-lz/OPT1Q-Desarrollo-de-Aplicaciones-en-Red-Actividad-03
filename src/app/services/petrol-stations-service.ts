import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { ListaEESSPrecio, PetrolStations } from '../common/petrolStation';
import { EstacionTerrestre } from '../common/estacion-terrestre';
import { CurrentLocation } from '../common/current-location';

const madrid_km_0 = {
  latitude: 40.4166161, 
  longitude: -3.7037883
}

@Injectable({
  providedIn: 'root',
})
export class PetrolStationsService {
  private readonly apiUrl: string = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres`;
  private _location = new BehaviorSubject<CurrentLocation>(new CurrentLocation(madrid_km_0));
  private _stationsAvailable = new BehaviorSubject<EstacionTerrestre[]>([]);

  constructor(private httpClient: HttpClient) {}
  

  /*------------------------------------*/
  /* Public Methods
  /*------------------------------------*/
  public get stations() : BehaviorSubject<EstacionTerrestre[]> {  
    return this._stationsAvailable;
  }

  public get location() : BehaviorSubject<CurrentLocation> {
    return this._location;
  }

  public set radius(radius: number) {
    if (this._location.getValue() != null && radius > 0.0){
      this._location.value.radius = radius;
      this.updateDrawnMarks();
    }
  }

  public get stationsCollection() : EstacionTerrestre[] {
    return this._stationsAvailable.getValue()
  }

  public get currentLocation() : CurrentLocation {
    return this._location.getValue();
  }

  public getPetrolStationsFromURL() : Observable<EstacionTerrestre[]> {
    return new Observable<EstacionTerrestre[]>(
      (obs) => {
        console.log(`Running getPetrolStationsFromURL`);
        var eessCollection : EstacionTerrestre[] = [];
        this.httpClient.get<PetrolStations>(this.apiUrl).subscribe(
          (data) => {
            const eessData : ListaEESSPrecio[] = data ? data['ListaEESSPrecio'] : [];

            for (var eess of eessData) {
              const e : EstacionTerrestre = new EstacionTerrestre(eess);
              eessCollection.push(e);
            }

            obs.next(eessCollection);
            obs.complete();
          }
        );
      }
    );
  }

  public getCurrentCoordenates() : Observable<CurrentLocation> {
    return new Observable<CurrentLocation>(
      (obs) => {
        console.log(`Running getCurrentCoordenates`);
        var loc : CurrentLocation = new CurrentLocation(madrid_km_0);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              loc = new CurrentLocation(
                {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                }
              );
            }
            console.log(loc);
            obs.next(loc);
            obs.complete();
          },
          (error) => {
            console.error(`Error obtaining geolocation: ${error}`);
          }
        );
      }
    );
  }

  /*------------------------------------*/
  /* Private Methods
  /*------------------------------------*/
  private static calculateDistance(
    lat1: number, lon1: number, 
    lat2: number, lon2: number) : number {
    const Earth_Radius = 6371e3; // metros
    const phi1 = lat1 * Math.PI/180; // radianes
    const phi2 = lat2 * Math.PI/180; // radianes
    const delta_latitude = (lat2-lat1) * Math.PI/180.0;
    const delta_longitude = (lon2-lon1) * Math.PI/180.0;

    const a = Math.sin(delta_latitude/2) * Math.sin(delta_longitude/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(delta_longitude/2) * Math.sin(delta_longitude/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return Earth_Radius * c; // metros
  }

  private updateDrawnMarks() {
    const r = this._location.getValue().radius;
    const eess = this._stationsAvailable.getValue();
    for (var i in eess) {
      const d = PetrolStationsService.calculateDistance(
        eess[i].latitude,
        eess[i].longitude,
        this.coordenates[0], 
        this.coordenates[1]
      );
      eess[i].drawn = ( d <= r ) ? true : false;
    }
    this._stationsAvailable.next(eess);
    this._stationsAvailable.complete();
  }

  private get coordenates() : [ number, number ] {
    return this._location.getValue().LatLong;
  }
}
