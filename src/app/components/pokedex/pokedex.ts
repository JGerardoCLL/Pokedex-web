import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonPage } from '../../models/pokemon.model';
import { FavoritesService } from '../../services/favorites.service';
import { PaginationService } from '../../services/pagination.service';
import { EstadosComponent } from '../estados de interfaz/estados';

@Component({
    selector: 'app-pokedex',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, EstadosComponent],
    templateUrl: './pokedex.html',
    styleUrl: './pokedex.css'
})

export class PokedexComponent{
    searchTerm = '';
    selectedType = '';
    currentPage = 1;
    pageSize = 20;
    pokemonPage?: PokemonPage;
    estado: 'loading' | 'error' | 'ready' = 'loading';
    mensajeEstado = '';


    constructor(
      private pokemonService: PokemonService,
      private favoritesService: FavoritesService,
      private paginationService: PaginationService
    ) {
      //recuperar la página actual del servicio de paginación
      this.currentPage = this.paginationService.getPage();
      this.loadPokemons();
    }

    get pokemon(): Pokemon[] {
      return this.pokemonPage?.results ?? [];
    }

    get favoriteCount(): number {
      return this.favoritesService.getCount();
    }

    loadPokemons(): void {
      this.estado = 'loading';
      this.mensajeEstado = '';

      this.pokemonService.getPokemonIndex().subscribe({
      next: (page) => {
        this.pokemonPage = page;
        this.estado = 'ready';
      },
      error: (error) => {
        console.error('Error al cargar los Pokémon:', error);
        this.estado = 'error';
        this.mensajeEstado = 'No se pudo conectar con la API. Revisa tu conexión.';
      }
    });
    }

    //obtener tipos unicos de los pokemones
  get types(): string[] {
    return [...new Set(this.pokemon.flatMap((pokemon) => pokemon.types)
    )];
  }

  // Filtrar los pokemones por nombre, numero o tipo
  get filteredPokemon(): Pokemon[] {
  const search = this.searchTerm.trim().toLowerCase();

  return this.pokemon.filter((poke) => {
    const matchesName = poke.name.toLowerCase().includes(search);
    const matchesNumber =
      poke.id.toString().includes(search) ||
      poke.id.toString().padStart(3, '0').includes(search);

    const matchesType = this.selectedType
      ? poke.types.includes(this.selectedType)
      : true;

    return (matchesName || matchesNumber) && matchesType;
  });
  }

  get paginatedPokemon(): Pokemon[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPokemon.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPokemon.length / this.pageSize);
  }
  // filtros
  search(): void {
    this.currentPage = 1;
    this.paginationService.resetPage();
  }

  filterByType(): void {
    this.currentPage = 1;
    this.paginationService.resetPage();
  }
  // Paginación
  previousPage(): void {
    if (this.currentPage > 1) {
        this.currentPage--;
      this.paginationService.setPage(this.currentPage);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
        this.currentPage++;
      this.paginationService.setPage(this.currentPage);
    }
  }

 
}


