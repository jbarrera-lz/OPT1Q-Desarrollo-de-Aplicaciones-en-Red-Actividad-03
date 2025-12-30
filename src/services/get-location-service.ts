import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Coordenates } from '../common/coordenates';

@Injectable({
  providedIn: 'root',
})
export class GetLocationService {
  private _coordenates: BehaviorSubject<Coordenates | null> = new BehaviorSubject<Coordenates | null>(null);

  constructor() {
    console.log('GetLocationService constructor called.');
  }

  public get position() : Observable<Coordenates | null> {
    console.log('GetLocationService position accessed.');
    return this._coordenates.asObservable();
  }

  public set position(value: Coordenates | null) {
    console.log('GetLocationService position set to:', value);
    this._coordenates.next(value);
  }
}