import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordenates } from '../common/coordenates';

@Injectable({
  providedIn: 'root',
})
export class GetLocationService {
  private _coordenates: Coordenates | null = null;

  public getMyLocation(): Observable<Coordenates | null> {
    return new Observable<Coordenates | null>(
      (myobserver) => {
        if (this._coordenates) {
          myobserver.next(this._coordenates);
          myobserver.complete();
        } else {
          navigator.geolocation.getCurrentPosition (
            (position) => {
              if (position) {
                this._coordenates = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                myobserver.next(this._coordenates);
              } else {
                myobserver.next(null);
              }
              myobserver.complete();
            },
            (error) => {
              console.error(`Error obtaining geolocation: ${error}`);
              myobserver.next(null);
              myobserver.complete();
            }
          );
        }
      }
    );
  }

  public get position() : Coordenates | null {
    console.log(`GetLocationService position accessed. Returning coordinates: ${this._coordenates}`);
    return this._coordenates;
  }

  public set position(value: Coordenates | null) {
    console.log('GetLocationService position set to:', value);
    this._coordenates = value;
  }
}