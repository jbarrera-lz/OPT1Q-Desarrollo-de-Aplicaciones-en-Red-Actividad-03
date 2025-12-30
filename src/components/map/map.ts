import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { GoogleMapsModule } from '@angular/google-maps';

import { Coordenates } from '../../common/coordenates';
import { PetrolStation } from '../../common/petrolStation';

import { GetLocationService } from '../../services/get-location-service';
import { PetrolStationsService } from '../../services/petrol-stations-service';

@Component({
  selector: 'app-map-component',
  imports: [
    AsyncPipe, GoogleMapsModule
  ],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit {
  public coor$!: Observable<Coordenates | null>;
  public petrolStation$!: Observable<PetrolStation | null>;

  constructor(
    private _getLocationService: GetLocationService,
    private _petrolStationsService: PetrolStationsService
  ) { 
    console.log(`MapComponent constructor called.`);
    this.coor$ = this._getLocationService.position;
    this.petrolStation$ = this._petrolStationsService.getPetrolStations();
  }

  ngOnInit(): void {
    console.log(`MapComponent ngOnInit called.`);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            this._getLocationService.position = { 
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            console.log(`Fetched geolocation:`, position.coords);
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

}
