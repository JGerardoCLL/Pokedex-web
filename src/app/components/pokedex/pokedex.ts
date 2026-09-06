import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';

interface Pokemon {
    id: number;
    name: string;
    image: string;
    types: string[];
}

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


    constructor(private pokemonService: PokemonService) {
      this.loadPokemons();
    }

    pokemon: Pokemon[] = [];

    loadPokemons(): void {
    this.pokemonService.getPokemons(20, 0).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
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
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredPokemon.slice(startIndex, endIndex);
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


