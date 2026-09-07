import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { FavoritesService } from '../../services/favorites.service';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favoritos.html'
})
export class FavoritosComponent {
  favoritePokemon: Pokemon[] = [];

  constructor(
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService
  ) {
    const favoriteIds = this.favoritesService.getIds();

    this.pokemonService.getPokemonIndex().subscribe({
      next: (page) => {
        this.favoritePokemon = page.results.filter((pokemon) =>
          favoriteIds.includes(pokemon.id)
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar favoritos:', error);
        this.loading = false;
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

  loading = true;
}