import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from '../components/map/map';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule, 
    MapComponent
],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  constructor() {
    
  };
}
