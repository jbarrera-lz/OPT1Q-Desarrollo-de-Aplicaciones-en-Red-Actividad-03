import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PetrolStation } from '../common/petrolStation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PetrolStationsService {
  private readonly apiUrl: string = `https://jsonplaceholder.typicode.com/posts/1`;
  constructor(private httpClient: HttpClient) { }

  getPetrolStations(): Observable<PetrolStation> {
    return this.httpClient.get<PetrolStation>(this.apiUrl);
  }
}
