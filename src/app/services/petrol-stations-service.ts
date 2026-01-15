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
  // Filtros
  private _whitelistBrands: string[] = [];
  private _blacklistBrands: string[] = [];
  private _fuelType: string | null = null; // ej: 'PrecioGasolina95E5'

  constructor(private httpClient: HttpClient) {}
  

  /*------------------------------------*/
  /* Public Methods
  /*------------------------------------*/
  public updateLocationManually(lat: number, lon: number): void {
  const loc = this._location.getValue();
  loc.updateCoordenates(lat, lon);
  this._location.next(loc);
  this.updateDrawnMarks();
}

public updateRadiusKm(r: number): void {
  const loc = this._location.getValue();
  loc.radius = r;
  this._location.next(loc);
  this.updateDrawnMarks();
}
  /** Lista blanca de marcas (solo estas) */
  public set whitelistBrands(brands: string[]) {
    this._whitelistBrands = brands.map(b => b.toLowerCase());
    this.updateDrawnMarks();
  }

  /** Lista negra de marcas (excluir estas) */
  public set blacklistBrands(brands: string[]) {
    this._blacklistBrands = brands.map(b => b.toLowerCase());
    this.updateDrawnMarks();
  }

  /** Tipo de carburante a filtrar (campo de EstacionTerrestre) */
  public set fuelType(fuel: string | null) {
    this._fuelType = fuel;
    this.updateDrawnMarks();
  }

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
          }
        );
      }
    );
  }

  public getCurrentCoordenates(): Observable<CurrentLocation> {
  return new Observable<CurrentLocation>((obs) => {
    console.log(`Running getCurrentCoordenates`);

    // Localización por defecto (Madrid km 0)
    let loc: CurrentLocation = new CurrentLocation(madrid_km_0);

    // Si el navegador no soporta geolocalización, devolvemos directamente el fallback
    if (!('geolocation' in navigator)) {
      console.warn('Geolocation not supported, using fallback location.');
      this._location.next(loc);
      this.updateDrawnMarks();
      obs.next(loc);
      obs.complete();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position) {
          loc = new CurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }

        // Actualizamos el BehaviorSubject global
        this._location.next(loc);
        this.updateDrawnMarks();

        // Devolvemos la localización (éxito)
        obs.next(loc);
        obs.complete();
      },
      (error) => {
        console.error(`Error obtaining geolocation: ${error.message}`);

        // Fallback: usamos Madrid (o lo que quieras) pero EMITIMOS igual
        this._location.next(loc);
        this.updateDrawnMarks();

        obs.next(loc);
        obs.complete();
      },
      {
        timeout: 5000, // opcional, por si se queda colgado el GPS
      }
    );
  });
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
    const r = this._location.getValue().radius; // metros
    const eess = this._stationsAvailable.getValue();
    const [lat0, lon0] = this.coordenates;

    for (const station of eess) {
      // 1) filtro por radio
      const d = PetrolStationsService.calculateDistance(
        station.latitude,
        station.longitude,
        lat0,
        lon0
      );

      let visible = d <= r;

      // 2) filtro por lista blanca de marcas
      if (visible && this._whitelistBrands.length > 0) {
        visible = this._whitelistBrands.includes(station.rotulo.toLowerCase());
      }

      // 3) filtro por lista negra de marcas
      if (visible && this._blacklistBrands.length > 0) {
        if (this._blacklistBrands.includes(station.rotulo.toLowerCase())) {
          visible = false;
        }
      }

      // 4) filtro por tipo de carburante (que tenga precio en ese campo)
      if (visible && this._fuelType) {
        const priceStr = (station as any)[this._fuelType] as string;
        if (!priceStr || priceStr.trim() === '') {
          visible = false;
        }
      }

      station.drawn = visible;
    }

    this._stationsAvailable.next(eess);
  }


  private get coordenates() : [ number, number ] {
    return this._location.getValue().LatLong;
  }
}
