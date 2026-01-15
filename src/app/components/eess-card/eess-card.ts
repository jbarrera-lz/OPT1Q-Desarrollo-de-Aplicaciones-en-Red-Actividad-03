import { Component, Input } from '@angular/core';
import { EstacionTerrestre } from '../../common/estacion-terrestre';


@Component({
  selector: 'app-eess-card',
  imports: [],
  templateUrl: './eess-card.html',
  styleUrl: './eess-card.css',
})
export class EessCard {
  @Input() station!: EstacionTerrestre;
}
