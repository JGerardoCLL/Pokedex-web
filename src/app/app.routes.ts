import { Routes } from '@angular/router';
import { PokedexComponent } from './components/pokedex/pokedex';
import { FavoritosComponent } from './components/favoritos/favoritos';
import { DetallesComponent } from './components/detalles pokemon/detalles';

export const routes: Routes = [
    { path: '', component: PokedexComponent },
    { path: 'favoritos', component: FavoritosComponent },
    { path: 'detalles/:id', component: DetallesComponent }
];
