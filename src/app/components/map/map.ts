import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import * as L from 'leaflet';

import { CurrentLocation } from '../../common/current-location';
import { EstacionTerrestre } from '../../common/estacion-terrestre';

import { PetrolStationsService } from '../../services/petrol-stations-service';
import { EessCard } from '../eess-card/eess-card';

@Component({
  selector: 'app-map-component',
  imports: [
    AsyncPipe, FormsModule, EessCard
],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit {

  /*------------------------------------*/
  /*  Members 
  /*------------------------------------*/
  public coor$!: BehaviorSubject<CurrentLocation>;
  public petrolStation$!: BehaviorSubject<EstacionTerrestre[]>;

  public showCards: boolean = false;
  // Filtros
  public selectedFuelType: string | null = null;
  public includeBrands: string = '';   // lista blanca, separado por comas
  public excludeBrands: string = '';   // lista negra, separado por comas

  private _map!: L.Map;
  private readonly _tile = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

  /*------------------------------------*/
  /* Constructor
  /*------------------------------------*/
  constructor(
    private _petrolStationsService: PetrolStationsService,
    private _activatedRoute: ActivatedRoute
  ) { 
      this.coor$ = this._petrolStationsService.location;
      this.petrolStation$ = this._petrolStationsService.stations;
  }

  /*------------------------------------*/
  /* Lifecycle Hooks
  /*------------------------------------*/
  ngOnInit(): void {
    console.log(`MapComponent ngOnInit called.`);    
    this._activatedRoute.data.subscribe(
      (data) => {
        this.petrolStation$.next(data['petrolStations']);
        this.coor$.next(data['currentLocation']);
      }
    );

    this._petrolStationsService.radius = this.coor$.getValue().radius;
    this.drawMap();
  }

  /*------------------------------------*/
  /* Public Methods
  /*------------------------------------*/
  public updateCircle(): void {  ;
    this._map.remove();
    this.drawMap();
  }

  public updateShowCards() : boolean {
    for(var station of this.petrolStation$.getValue()){
      if(station.drawn){
        this.showCards = true
        return this.showCards;
      }
    }
    this.showCards = false;
    return this.showCards;
  }

  public set mapRadius(radius: number) {
    this._petrolStationsService.radius = radius;
    this.updateShowCards();
  }
  

    /*------------------------------------*/
  /* Coordenadas manuales (entrada usuario)
  /*------------------------------------*/

  public manualLat: number | null = null;
  public manualLon: number | null = null;

  public useManualLocation(): void {
    if (this.manualLat != null && this.manualLon != null) {
      // Actualizamos localización desde el servicio
      this._petrolStationsService.updateLocationManually(
        this.manualLat,
        this.manualLon
      );

      // Redibujamos mapa y actualizamos tarjetas visibles
      this.updateCircle();
      this.updateShowCards();
    }
  }

public applyFilters(): void {
    const whitelist = this.includeBrands
      .split(',')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const blacklist = this.excludeBrands
      .split(',')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    this._petrolStationsService.whitelistBrands = whitelist;
    this._petrolStationsService.blacklistBrands = blacklist;
    this._petrolStationsService.fuelType = this.selectedFuelType;

    this.updateShowCards();
  }
  public get visibleStations(): EstacionTerrestre[] {
  // Primero, estaciones dentro del radio / marcas (drawn = true)
  let stations = this.petrolStation$.getValue().filter(s => s.drawn);

  // Si no hay tipo de carburante seleccionado, devolvemos todas las "drawn"
  if (!this.selectedFuelType) {
    return stations;
  }

  // Si hay tipo de carburante, nos quedamos solo con las que tienen precio para ese tipo
  const field = this.selectedFuelType; // ej: 'gasolina95E5'

  stations = stations.filter(s => {
    const priceStr = (s as any)[field] as string;
    return priceStr && priceStr.trim() !== '';
  });

  return stations;
}

    public get cheapestStation(): EstacionTerrestre | null {
    const stations = this.visibleStations;
    if (stations.length === 0 || !this.selectedFuelType) return null;

    const field = this.selectedFuelType; // ej: 'PrecioGasolina95E5'

    const candidates = stations.filter(s => {
      const priceStr = (s as any)[field] as string;
      return priceStr && priceStr.trim() !== '';
    });

    if (candidates.length === 0) return null;

    return candidates.reduce((min, current) => {
      const pMinStr = (min as any)[field] as string;
      const pCurStr = (current as any)[field] as string;

      const pMin = parseFloat(pMinStr.replace(',', '.'));
      const pCur = parseFloat(pCurStr.replace(',', '.'));

      return pCur < pMin ? current : min;
    });
  }

  /*------------------------------------*/
  /* Private Methods
  /*------------------------------------*/
  private drawMap(): void {
    console.log(`[MapComponent] Calling drawMap method`);
    
    const coor : CurrentLocation = this.coor$.getValue();
    console.log(`CurrentLocation coordenates - ${coor.LatLong}`);
    
    this._map = L.map('map').setView(coor.LatLong, 13);
    this._tile.addTo(this._map);
    coor.marker.addTo(this._map);
    coor.circle.addTo(this._map);

    console.log(`Current stations available: ${this.petrolStation$.getValue().length}`);

    for (var station of this.petrolStation$.getValue()) {
      if(station.drawn) {
        station.marker.addTo(this._map);
      }
    }
  }

    private calculateDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
  ): number {
    const Earth_Radius = 6371e3; // metros
    const phi1 = lat1 * Math.PI/180;
    const phi2 = lat2 * Math.PI/180;
    const delta_latitude = (lat2-lat1) * Math.PI/180.0;
    const delta_longitude = (lon2-lon1) * Math.PI/180.0;

    const a = Math.sin(delta_latitude/2) * Math.sin(delta_latitude/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(delta_longitude/2) * Math.sin(delta_longitude/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Earth_Radius * c;
  }

  public get nearestStation(): EstacionTerrestre | null {
  const stations = this.visibleStations;
  if (stations.length === 0) return null;

  const coor = this.coor$.getValue();
  const [lat0, lon0] = coor.LatLong;

  return stations.reduce((min, current) => {
    const dMin = this.calculateDistance(min.latitude, min.longitude, lat0, lon0);
    const dCur = this.calculateDistance(current.latitude, current.longitude, lat0, lon0);
    return dCur < dMin ? current : min;
  });
}


}
