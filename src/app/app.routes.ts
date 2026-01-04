import { Routes } from '@angular/router';
import { Home } from './home/home';
import { petrolStationResolver } from './resolvers/petrol-station-resolver';

export const routeConfig: Routes = [
    {
        path: '',
        component: Home,
        title: 'Inicio - UNIR GII Desarrollo de Aplicaciones en Red',
        resolve: {
            petrolStations: petrolStationResolver
        }
    },
];
