import { Component, OnInit, AfterViewInit } from '@angular/core';
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
export class MapComponent implements OnInit, AfterViewInit {
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
      this.coor$ = this._getLocationService.position;
      this.petrolStation$ = this._petrolStationsService.getPetrolStations();
  }

  /*------------------------------------*/
  /* Lifecycle Hooks
  /*------------------------------------*/
  public ngAfterViewInit(): void {
    console.log(`MapComponent ngAfterViewInit called.`);
    
    // this.petrolStation$.subscribe(
    //   (data) => {
    //     this._eess = data ? data.ListaEESSPrecio : [];
    //     console.log(`Fetched ${this._eess.length} petrol stations from service.`);
    //     if(this._eess.length > 0){
    //       this.addPetrolStationMarkers();
    //     }
    //   }
    // );

    this._activatedRoute.data.subscribe(
      (data) => {
        this._eess = data['petrolStations'] ? data['petrolStations'].ListaEESSPrecio : [];
        console.log(`Fetched by Resolver ${this._eess.length} petrol stations from resolver.`);
        if(this._eess.length > 0){
          this.addPetrolStationMarkers();
        }
      }
    );
  }

  public ngOnInit(): void {
    console.log(`MapComponent ngOnInit called.`);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            console.log(`Geolocation fetched: Lat ${position.coords.latitude}, Lon ${position.coords.longitude}`);

            this._getLocationService.position = { 
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };

            this._markers.push(L.marker(
              [
                position.coords.latitude, 
                position.coords.longitude
              ],
              {
                icon: this._iconCurrentLocation,
                alt: 'Current Location Marker',
                riseOnHover: true,
                title: `Posición Actual:
LATITUD: ${position.coords.latitude}º
LONGITUD: ${position.coords.longitude}º`
              }
            ));

            this.initMap();
            
          }
        },
        (error) => {
          console.error(`Error fetching geolocation:`, error);
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.');
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
    this._map = L.map('map');
    
    this._map.setView(
      this._markers[0].getLatLng(), 13
    );
        
    L.tileLayer(baseMapURl).addTo(this._map);
    this.addCurrentLocationMarker();
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

  private addCurrentLocationMarker(): void {
    if (this._map) {
      this._markers[0].addTo(this._map);
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
        this._markers[0].getLatLng().lat,
        this._markers[0].getLatLng().lng,
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
