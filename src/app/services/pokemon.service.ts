import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import {
  Pokemon,
  PokemonPage,
  PokemonDetail,
  PokemonListResponse
} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2/';

  getPokemons(limit = 20, offset = 0): Observable<PokemonPage> {
    return this.http.get<PokemonListResponse>(
      `${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`
    ).pipe(
      switchMap((response) => {
        const requests = response.results.map((pokemon) => {

          const id = this.getPokemonId(pokemon.url);
          return this.getPokemonById(id);
        });
        return forkJoin(requests).pipe(
          map((pokemonDetails) => ({
            count: response.count,
            next: response.next,
            previous: response.previous,
            results: pokemonDetails
          }))
        );
      })
    );
  }

  private getPokemonId(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
  }

  getPokemonById(id: number): Observable<PokemonDetail> {
    return this.http
      .get<any>(`${this.apiUrl}/pokemon/${id}`)
      .pipe(
        switchMap((pokemon) =>
          forkJoin({
            species: this.http.get<any>(
              `${this.apiUrl}/pokemon-species/${id}`
            ),
            pokemon: of(pokemon)
          })
        ),
        map(({ pokemon, species }) => ({
          id: pokemon.id,
          name: pokemon.name,
          height: pokemon.height,
          weight: pokemon.weight,
          types: pokemon.types.map(
            (item: { type: { name: string } }) => item.type.name
          ),
          abilities: pokemon.abilities.map(
            (item: { ability: { name: string }; is_hidden: boolean }) => ({
              name: item.ability.name,
              isHidden: item.is_hidden
            })
          ),
          description: this.getSpanishDescription(species),
          stats: pokemon.stats.map(
            (item: { base_stat: number; stat: { name: string } }) => ({
              name: item.stat.name,
              baseStat: item.base_stat
            })
          ),
          image: pokemon.sprites.front_default,
          artwork: pokemon.sprites.other['official-artwork'].front_default
        }))
      );
  }

  private getSpanishDescription(species: any): string {
    const flavorTextEntry = species.flavor_text_entries.find(
      (entry: { language: { name: string } }) =>
        entry.language.name === 'es'
    );

    return flavorTextEntry
      ? flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ')
      : '';
  }
}