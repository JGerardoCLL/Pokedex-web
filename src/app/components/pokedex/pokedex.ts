import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Pokemon {
    id: number;
    name: string;
    type: string;
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

    pokemon: Pokemon[] = [
      { id: 1, name: 'Bulbasaur', type: 'Grass' },
      { id: 2, name: 'Ivysaur', type: 'Grass' },
      { id: 3, name: 'Venusaur', type: 'Grass' },
      { id: 4, name: 'Charmander', type: 'Fire' },
      { id: 5, name: 'Charmeleon', type: 'Fire' },
      { id: 6, name: 'Charizard', type: 'Fire' },
      { id: 7, name: 'Squirtle', type: 'Water' },
      { id: 8, name: 'Wartortle', type: 'Water' },
      { id: 9, name: 'Blastoise', type: 'Water' },
      { id: 10, name: 'Caterpie', type: 'Bug' },
      { id: 11, name: 'Metapod', type: 'Bug' },
      { id: 12, name: 'Butterfree', type: 'Bug' },
      { id: 13, name: 'Weedle', type: 'Poison' },
      { id: 14, name: 'Kakuna', type: 'Poison' },
      { id: 15, name: 'Beedrill', type: 'Poison' },
      { id: 16, name: 'Pidgey', type: 'Flying' },
      { id: 17, name: 'Pidgeotto', type: 'Flying' },
      { id: 18, name: 'Pidgeot', type: 'Flying' },
      { id: 19, name: 'Rattata', type: 'Normal' },
      { id: 20, name: 'Raticate', type: 'Normal' },
      { id: 21, name: 'Spearow', type: 'Flying' },
      { id: 22, name: 'Fearow', type: 'Flying' },
      { id: 23, name: 'Ekans', type: 'Poison' },
      { id: 24, name: 'Arbok', type: 'Poison' },
      { id: 25, name: 'Pikachu', type: 'Electric' },
      { id: 26, name: 'Raichu', type: 'Electric' },
      { id: 27, name: 'Sandshrew', type: 'Ground' },
      { id: 28, name: 'Sandslash', type: 'Ground' },
      { id: 29, name: 'Nidoran', type: 'Poison' },
      { id: 30, name: 'Nidorina', type: 'Poison' }
    ];

  get types(): string[] {
    return [...new Set(this.pokemon.map(p => p.type))];
  }

  get filteredPokemon(): Pokemon[] {
    const search = this.searchTerm.toLowerCase();

    return this.pokemon.filter((poke) => {
        const matchesName = poke.name.toLowerCase().includes(search);
        const matchesNumber = poke.id.toString().includes(this.searchTerm);
        const formattedNumber = poke.id.toString().padStart(3, '0');

        const matchesType = this.selectedType ? poke.type === this.selectedType : true;
        const pokeNumber = matchesNumber || formattedNumber.includes(this.searchTerm);
        return (matchesName || pokeNumber) && matchesType;
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
