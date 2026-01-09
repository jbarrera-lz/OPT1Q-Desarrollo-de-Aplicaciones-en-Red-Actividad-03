import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import * as L from 'leaflet';

import { Coordenates } from '../../common/coordenates';
import { CurrentLocation } from '../../common/current-location';
import { EstacionTerrestre } from '../../common/estacion-terrestre';
import { PetrolStations, ListaEESSPrecio } from '../../common/petrolStation';

import { GetLocationService } from '../../services/get-location-service';
import { PetrolStationsService } from '../../services/petrol-stations-service';

import { EESSAvailableTable } from '../eessavailable-table/eessavailable-table';

@Component({
  selector: 'app-map-component',
  imports: [
    AsyncPipe, FormsModule,
    EESSAvailableTable
],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit {

  /*------------------------------------*/
  /*  Members 
  /*------------------------------------*/
  public coor$!: Observable<Coordenates | null>;
  public petrolStation$!: Observable<PetrolStations | null>;

  private _map!: L.Map;
  private _currentLocation!: CurrentLocation;
  private _stationsAvailable: EstacionTerrestre[] = [];

  private readonly _tile = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

  /*------------------------------------*/
  /* Constructor
  /*------------------------------------*/
  constructor(
    private _getLocationService: GetLocationService,
    private _petrolStationsService: PetrolStationsService,
    private _activatedRoute: ActivatedRoute
  ) { 
      console.log(`MapComponent constructor called.`);
      this.coor$ = this._getLocationService.getMyLocation();
      this.petrolStation$ = this._petrolStationsService.getPetrolStations();
  }

  /*------------------------------------*/
  /* Lifecycle Hooks
  /*------------------------------------*/
  public ngOnInit(): void {
    console.log(`MapComponent ngOnInit called.`);

    this._activatedRoute.data.subscribe(
      (data) => {
        const coor : Coordenates = data['currentLocation'] ? data['currentLocation'] : null;
        this._currentLocation = new CurrentLocation(coor);
        
        if (this._currentLocation != null) {
          console.log(
            `Fetched by Resolver: [${this._currentLocation.coor.latitude}º, ${this._currentLocation.coor.longitude}º]`
          );
        }
        else {
          console.error(`currentLocation is 'null'!!!`);
        }
        
        const eessData : ListaEESSPrecio[] = data['petrolStations'] ? data['petrolStations'].ListaEESSPrecio : [];
        for (var eess of eessData) {
          const e : EstacionTerrestre = new EstacionTerrestre(eess);
          this._stationsAvailable.push(e);
        }

        console.log(
          `Fetched by Resolver - ${this._stationsAvailable.length} petrol stations.`
        );
      }
    );

    this.drawMap();
  }

  /*------------------------------------*/
  /* Public Methods
  /*------------------------------------*/
  public updateCircle(r: number): void {  
    console.log(`Updating circle with radius: ${r} meters.`);
    this._currentLocation.radius = r;
    this._map.remove();
    this.drawMap();
  }

  /*------------------------------------*/
  /* Private Methods
  /*------------------------------------*/
  private drawMap(): void {
    console.log(`Initializing map...`);
    if (this._currentLocation != null) {
      this._map = L.map('map').setView( this._currentLocation.LatLong, 10);
      this._tile.addTo(this._map);
      this._currentLocation.marker.addTo(this._map);
      this._currentLocation.circle.addTo(this._map);
    }

    if(this._stationsAvailable.length > 0) {
      this.getPetrolStationsWithinRadius();

      for (var i in this._stationsAvailable) {
        if (this._stationsAvailable[i].drawn) {
          this._stationsAvailable[i].marker.addTo(this._map);
        }
      }
    }
  }

  private getPetrolStationsWithinRadius(): void { 
    const lat  : number = this._currentLocation.coor.latitude;
    const long : number = this._currentLocation.coor.longitude;
    const r    : number = this._currentLocation.radius;

    for (var i in this._stationsAvailable) {
      const distance = MapComponent.calculateDistance(
        lat, long, 
        this._stationsAvailable[i].latitude,
        this._stationsAvailable[i].longitude
      );

      this._stationsAvailable[i].drawn = ( distance <= r ) ? true : false;
    }
  }
  /*------------------------------------*/
  /* Static Methods
  /*------------------------------------*/
  public static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

  /*------------------------------------*/
  /* Getters and Setters
  /*------------------------------------*/
  /* currentLocation */
  public get currentLocation() : CurrentLocation {
    return this._currentLocation;
  }

  /* Get number of estaciones terrestres drawn */
  public get numero_estaciones_terrestres_dibujadas() : { count: number, available: boolean } {
    let c : number = 0;
    for (var i in this._stationsAvailable) {
      if (this._stationsAvailable[i].drawn) {
        c++;
      }
    }
    return { count: c, available: c > 0 ? true : false};
  }

  /* Get Available Stations */
  public get stationsAvailable() : EstacionTerrestre[] {
    return this._stationsAvailable;
  }
}
