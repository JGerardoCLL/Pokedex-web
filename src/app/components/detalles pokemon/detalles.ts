import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetail } from '../../models/pokemon.model';
import { FavoritesService } from '../../services/favorites.service';
import { EstadosComponent } from '../estados de interfaz/estados';


@Component({
    selector: 'app-detalles',
    standalone: true,
    imports: [CommonModule, RouterLink, EstadosComponent],
    templateUrl: './detalles.html',
})
export class DetallesComponent {
    pokemon?: PokemonDetail;
    pokemonId!: number;
    returnPage = 1;
    estado: 'loading' | 'error' | 'ready' = 'loading';
    mensajeEstado = '';

    constructor(
      private route: ActivatedRoute,
      private favoritesService: FavoritesService,
      private pokemonService: PokemonService
    ) {
      this.route.paramMap.subscribe((params) => {
        this.pokemonId = Number(params.get('id'));
        this.loadPokemon();
      });

      this.route.queryParamMap.subscribe((params) => {
        this.returnPage = Number(params.get('page')) || 1;
      });
    }

    loadPokemon(): void {
      this.estado = 'loading';
      this.mensajeEstado = '';

      this.pokemonService.getPokemonById(this.pokemonId).subscribe({
        next: (pokemon) => {
          this.pokemon = pokemon;
          this.estado = 'ready';
        },
        error: (error) => {
          console.error('Error al cargar el Pokémon:', error);
          this.estado = 'error';
          this.mensajeEstado = 'No se pudo cargar este Pokémon.';
        }
      });
    }

    isFavorite(id: number): boolean {
    return this.favoritesService.isFavorite(id);
    }
    // Método para alternar el estado de favorito de un Pokémon
    toggleFavorite(id: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.favoritesService.toggle(id);
    }


}