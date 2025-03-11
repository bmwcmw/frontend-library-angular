import { Routes } from '@angular/router';
import { HomePageComponent } from "./home-page/home-page.component";

const routeConfig: Routes = [
    {
        path: '',
        component: HomePageComponent,
        title: 'Home page',
    },
];

export default routeConfig;