import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonDetail } from '../../models/pokemon.model';
import { FavoritesService } from '../../services/favorites.service';


@Component({
    selector: 'app-detalles',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './detalles.html',
})
export class DetallesComponent {
    pokemon$: Observable<PokemonDetail>;
    pokemonId!: number;
    returnPage = 1;

    constructor(
      private route: ActivatedRoute,
      private favoritesService: FavoritesService,
      private pokemonService: PokemonService
    ) {
      this.pokemon$ = this.route.paramMap.pipe(
        switchMap((params) => {
          this.pokemonId = Number(params.get('id'));
          return this.pokemonService.getPokemonById(this.pokemonId);
        })
      );

      this.route.queryParamMap.subscribe((params) => {
        this.returnPage = Number(params.get('page')) || 1;
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