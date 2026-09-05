import { Routes } from '@angular/router';
import { PokedexComponent } from './components/pokedex/pokedex';
import { FavoritosComponent } from './components/favoritos/favoritos';

export const routes: Routes = [
    { path: '', component: PokedexComponent },
    { path: 'favoritos', component: FavoritosComponent }
];
