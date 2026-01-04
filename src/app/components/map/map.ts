import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import * as L from 'leaflet';

import { Coordenates } from '../../common/coordenates';
import { PetrolStations } from '../../common/petrolStation';
import { ListaEESSPrecio } from '../../common/petrolStation';

import { GetLocationService } from '../../services/get-location-service';
import { PetrolStationsService } from '../../services/petrol-stations-service';

@Component({
  selector: 'app-map-component',
  imports: [
    AsyncPipe, FormsModule
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
  private _markers: L.Marker[] = [];
  private _circle!: L.CircleMarker;
  private _circleRadius: number = 3000; // in meters

  private _eess!: ListaEESSPrecio[];
  private _coor!: Coordenates;

  private readonly _iconPetrolStation = new L.Icon(
    {
      iconUrl: 'src/assets/img/local_gas.png',
      iconSize: [24, 24],
      iconAnchor: [24, 24],
      popupAnchor: [0, 0],
      className: 'gas-station-icon'
    }
  )

  private readonly _iconCurrentLocation = new L.Icon.Default;

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
        this._coor = data['currentLocation'] ? data['currentLocation'] : null;
        this._eess = data['petrolStations'] ? data['petrolStations'].ListaEESSPrecio : [];
        
        console.log(
          `Fetched by Resolver: [${this._coor.latitude}º] - [${this._coor.longitude}º] coordenates`
        );
        console.log(
          `Fetched by Resolver ${this._eess.length} petrol stations.`
        );
      }
    );

    this.initMap();

    if(this._eess.length > 0) {
      this.addPetrolStationMarkers();
    }
  }

  /*------------------------------------*/
  /* Public Methods
  /*------------------------------------*/
  public updateCircle(): void {   
    console.log(`Updating circle with radius: ${this.radius}`);

    if(this._circle){
      this._map.removeLayer(this._circle);
    }
    
    this.drawCircle();
    this.addPetrolStationMarkers();
  }

  /*------------------------------------*/
  /* Private Methods
  /*------------------------------------*/
  private initMap(): void { 
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const latlong = new L.LatLng(this._coor.latitude, this._coor.longitude);
    const marker = new L.Marker(latlong);
    const tile = new L.TileLayer(baseMapURl);

    this._markers.push(marker); // Adding the first marker as your current location
    this._map = L.map('map').setView(latlong, 13);
    tile.addTo(this._map);
    marker.addTo(this._map);
    this.drawCircle();
  }

  private drawCircle(): void {
    if (this._map && this.radius > 0) {
      this._circle = L.circle(this._markers[0].getLatLng(), {
        color: 'blue',
        fillColor: '#blue',
        fillOpacity: 0.1,
        weight: 0.25,
        radius: this.radius,
      });
      this._circle.addTo(this._map);
    }
  }


  private addPetrolStationMarkers(): void {
    const stationsWithinCurrentRadius : ListaEESSPrecio[] = this.getPetrolStationsWithinRadius();
    console.log(`Adding ${stationsWithinCurrentRadius.length} petrol station markers within radius ${this.radius} meters.`);
    
    for (const station of stationsWithinCurrentRadius) {
      const marker = L.marker(
        [
          parseFloat(station['Latitud']),
          parseFloat(station['Longitud (WGS84)'])
        ],
        {
          icon: this._iconPetrolStation,
          alt: 'Petrol Station Marker',
          riseOnHover: true,
          title: `${station['Rótulo']}:
Localidad: ${station['Localidad']},
Dirección: ${station['Dirección']},
Horario: ${station['Horario']}`
        });

      marker.addTo(this._map);
      this._markers.push(marker);
    }
  }

  private getPetrolStationsWithinRadius(): ListaEESSPrecio[] {
    const stationsWithinRadius: ListaEESSPrecio[] = [];

    for (const eess of this._eess) {
      const distancia = MapComponent.calculateDistance(
        this._coor.latitude,
        this._coor.longitude,
        parseFloat(eess['Latitud']),
        parseFloat(eess['Longitud (WGS84)'])
      );

      console.log(`Distance to station ${eess['Rótulo']}: ${distancia} meters.`);
      
      if (distancia <= this.radius) {
        stationsWithinRadius.push(eess);
      }
    }
    
    return stationsWithinRadius;
  }

  /*------------------------------------*/
  /* Static Methods
  /*------------------------------------*/
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
  public get radius(): number {
    return this._circleRadius; // metros
  }

  public set radius(value: number) {
    this._circleRadius = value; // metros
  }
}
