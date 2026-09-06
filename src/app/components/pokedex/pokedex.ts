import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon, PokemonPage } from '../../models/pokemon.model';

@Component({
    selector: 'app-pokedex',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './pokedex.html',
    styleUrl: './pokedex.css'
})

export class PokedexComponent{
    searchTerm = '';
    selectedType = '';
    currentPage = 1;
    pageSize = 20;
    pokemonPage?: PokemonPage;
    private hasLoaded = false;


    constructor(
      private pokemonService: PokemonService,
      private route: ActivatedRoute
    ) {
      this.route.queryParams.subscribe(params => {
        const page = Number(params['page']);
        this.currentPage = page > 0 ? page : 1;
        if (!this.hasLoaded) {
          this.loadPokemons();
        }
      });
    }

    get pokemon(): Pokemon[] {
      return this.pokemonPage?.results ?? [];
    }

    loadPokemons(): void {
    this.pokemonService.getPokemonIndex().subscribe({
      next: (page) => {
        this.pokemonPage = page;
        this.hasLoaded = true;
      },
      error: (error) => {
        console.error('Error al cargar los Pokémon:', error);
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

  search(): void {
    this.currentPage = 1;
  }

  filterByType(): void {
    this.currentPage = 1;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
        this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
        this.currentPage++;
    }
  }

 
}


