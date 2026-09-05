import { CommonModule} from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Pokemon {
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
    { name: 'Bulbasaur', type: 'Grass' },
    { name: 'Ivysaur', type: 'Grass' },
    { name: 'Venusaur', type: 'Grass' },
    { name: 'Charmander', type: 'Fire' },
    { name: 'Charmeleon', type: 'Fire' },
    { name: 'Charizard', type: 'Fire' },
    { name: 'Squirtle', type: 'Water' },
    { name: 'Wartortle', type: 'Water' },
    { name: 'Blastoise', type: 'Water' },
    { name: 'Pikachu', type: 'Electric' },
    { name: 'Raichu', type: 'Electric' },
    { name: 'Bulbasaur', type: 'Grass' },
    { name: 'Ivysaur', type: 'Grass' },
    { name: 'Venusaur', type: 'Grass' },
    { name: 'Charmander', type: 'Fire' },
    { name: 'Charmeleon', type: 'Fire' },
    { name: 'Charizard', type: 'Fire' },
    { name: 'Squirtle', type: 'Water' },
    { name: 'Wartortle', type: 'Water' },
    { name: 'Blastoise', type: 'Water' },
    { name: 'Pikachu', type: 'Electric' },
    { name: 'Raichu', type: 'Electric' },
    { name: 'Jigglypuff', type: 'Normal' }
  ];

  get types(): string[] {
    return [...new Set(this.pokemon.map(p => p.type))];
  }

  get filteredPokemon(): Pokemon[] {
    const search = this.searchTerm.toLowerCase();

    return this.pokemon.filter((poke) => {
        const matchesName = poke.name.toLowerCase().includes(search);
        const matchesType = this.selectedType ? poke.type === this.selectedType : true;
        return matchesName && matchesType;
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
