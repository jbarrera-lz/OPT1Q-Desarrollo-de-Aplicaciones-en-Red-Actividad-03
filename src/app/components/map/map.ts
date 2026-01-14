import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import * as L from 'leaflet';

import { CurrentLocation } from '../../common/current-location';
import { EstacionTerrestre } from '../../common/estacion-terrestre';

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
  public coor$!: BehaviorSubject<CurrentLocation>;
  public petrolStation$!: BehaviorSubject<EstacionTerrestre[]>;

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
        console.log(data['petrolStations']);
        this.petrolStation$.next(data['petrolStations']);
        
        console.log(data['currentLocation']);
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

  public set mapRadius(radius: number) {
    this._petrolStationsService.radius = radius;
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

    console.log(coor);

    console.log(`Current stations available: ${this.petrolStation$.getValue().length}`);

    for (var station of this.petrolStation$.getValue()) {
      if(station.drawn) {
        station.marker.addTo(this._map);
      }
    }
  }
}
