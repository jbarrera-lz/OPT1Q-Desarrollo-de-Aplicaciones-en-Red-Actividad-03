import { Coordenates } from "./coordenates";

import * as L from 'leaflet';

export class CurrentLocation {
  private _coordenates!: Coordenates;
  private _marker!: L.Marker;
  private _circle!: L.CircleMarker;
  private _circleRadius: number = 2500; // in meters
  
  // private readonly _icon = new L.Icon.Default;
  private readonly _icon = new L.Icon(
    {
      iconUrl: 'src/assets/img/person_pin_circle.png',
      iconSize: [48, 48],
      iconAnchor: [48, 48],
      popupAnchor: [0, 0],
      className: 'your-current-location-icon'
    }
  )

  constructor(coordenates: Coordenates) {
    this._coordenates = coordenates;
    this.circle = coordenates;
    this.marker = coordenates;
  }

  /** 
   * Getters and Setters 
  **/

  /** Coordenates */
  public get coor() : Coordenates {
   return this._coordenates;
  }

  public get LatLong() : [ number, number ] {
    return [
      this._coordenates.latitude,
      this._coordenates.longitude
    ];
  }

  /** Location Marker */
  public set marker(coordenates: Coordenates) {
    this._marker = new L.Marker(
      [
        coordenates.latitude, 
        coordenates.longitude
      ],
      {
        icon: this._icon,
        alt: `Current Location`,
        riseOnHover: true,
        title: `Your current location:\n${coordenates.latitude}º ,${coordenates.longitude}º`,
      }
    );
  }
  
  public get marker(): L.Marker {
    return this._marker;
  }
  
  /** Circle Marker */
  public set circle(coordenates: Coordenates) {
    this._circle = L.circle(
      [ 
        coordenates.latitude, 
        coordenates.longitude 
      ],
      {
        color: 'blue',
        fillColor: '#blue',
        fillOpacity: 0.05,
        weight: 0.25,
        radius: this.radius
      }
    );
  }

  public get circle() : L.CircleMarker {
    return this._circle;
  }

  /** radius */
  public get radius() : number {
    return this._circleRadius // in meters
  }

  public set radius(radius: number) {
    this._circleRadius = radius; // in meters
    this._circle = L.circle(
      this.LatLong,
      {
        color: 'blue',
        fillColor: '#blue',
        fillOpacity: 0.05,
        weight: 0.25,
        radius: this.radius
      }
    );
  }
}