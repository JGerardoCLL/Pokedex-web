import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-detalles',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './detalles.html',
})
export class DetallesComponent {
    title = 'Detalles de pokemones';
    pokemonId: number;
    pokemonName: string;
    pokemonType: string;

    constructor(private route: ActivatedRoute) {
        this.pokemonId = Number(this.route.snapshot.paramMap.get('id'));
        this.pokemonName = this.getPokemonName(this.pokemonId);
        this.pokemonType = this.getPokemonType(this.pokemonId);
    }

    get imageUrl(): string {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.pokemonId}.png`;
    }

    private getPokemonName(id: number): string {
        const names: Record<number, string> = {
            1: 'Bulbasaur', 2: 'Ivysaur', 3: 'Venusaur',
            4: 'Charmander', 5: 'Charmeleon', 6: 'Charizard',
            7: 'Squirtle', 8: 'Wartortle', 9: 'Blastoise',
            25: 'Pikachu', 26: 'Raichu'
        };

        return names[id] ?? 'Pokémon';
    }

    private getPokemonType(id: number): string {
        const types: Record<number, string> = {
            1: 'Grass', 2: 'Grass', 3: 'Grass',
            4: 'Fire', 5: 'Fire', 6: 'Fire',
            7: 'Water', 8: 'Water', 9: 'Water',
            25: 'Electric', 26: 'Electric'
        };

        return types[id] ?? 'Unknown';
    }
}