import { Routes } from '@angular/router';
import { Home } from './home/home';
import { BlogArticle } from './blog-article/blog-article';
import { MapComponent } from '../components/map/map';


export const routeConfig: Routes = [
    {
        path: '',
        component: Home,
        title: 'UNIR GII Desarrollo de Aplicaciones en Red'
    },
    {
        path: 'details/:id',
        component: BlogArticle,
        title: 'Details Page'
    },
    {
        path: 'location',
        component: MapComponent,
        title: 'Map',
    }
];
