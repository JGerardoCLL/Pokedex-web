import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { FavoritesService } from '../../services/favorites.service';
import { Pokemon } from '../../models/pokemon.model';
import { EstadosComponent } from '../estados de interfaz/estados';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterLink, EstadosComponent],
  templateUrl: './favoritos.html'
})
export class FavoritosComponent {
  favoritePokemon: Pokemon[] = [];
  estado: 'loading' | 'error' | 'ready' = 'loading';
  mensajeEstado = '';

  constructor(
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService
  ) {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.estado = 'loading';
    this.mensajeEstado = '';
    const favoriteIds = this.favoritesService.getIds();

    this.pokemonService.getPokemonIndex().subscribe({
      next: (page) => {
        this.favoritePokemon = page.results.filter((pokemon) =>
          favoriteIds.includes(pokemon.id)
        );
        this.estado = 'ready';
      },
      error: (error) => {
        console.error('Error al cargar favoritos:', error);
        this.estado = 'error';
        this.mensajeEstado = 'No se pudieron cargar tus favoritos.';
      }
    });
  }

  removeFavorite(id: number): void {
    this.favoritesService.remove(id);

    this.favoritePokemon = this.favoritePokemon.filter(
      (pokemon) => pokemon.id !== id
    );
  }

  get favoriteCount(): number {
    return this.favoritesService.getCount();
  }

}