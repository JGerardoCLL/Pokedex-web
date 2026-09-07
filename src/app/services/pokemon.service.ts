import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import {
  Pokemon,
  PokemonPage,
  PokemonDetail,
  PokemonListResponse,
  PokemonApiResponse,
  PokemonSpeciesResponse,
  PokemonTypeResponse,
  PokemonTypeListResponse,
  PokemonTypeSummary
} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2';
  private readonly pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  getPokemonIndex(): Observable<PokemonPage> {
    return forkJoin({
      list: this.http.get<PokemonListResponse>(
        `${this.apiUrl}/pokemon?limit=1302&offset=0`
      ),
      types: forkJoin(
        this.pokemonTypes.map((type) =>
          this.http.get<PokemonTypeResponse>(`${this.apiUrl}/type/${type}`)
        )
      )
    }).pipe(
      map(({ list, types }) => {
        const typesByPokemon = new Map<number, string[]>();

        types.forEach((typeResponse, typeIndex) => {
          typeResponse.pokemon.forEach(({ pokemon }) => {
            const id = this.getPokemonId(pokemon.url);
            const pokemonTypes = typesByPokemon.get(id) ?? [];
            pokemonTypes.push(this.pokemonTypes[typeIndex]);
            typesByPokemon.set(id, pokemonTypes);
          });
        });

        return {
          count: list.count,
          next: null,
          previous: null,
          results: list.results.map((pokemon) => {
            const id = this.getPokemonId(pokemon.url);
            return {
              id,
              name: pokemon.name,
              types: typesByPokemon.get(id) ?? [],
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            };
          })
        };
      })
    );
  }

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

  getPokemonTypes(): Observable<string[]> {
    return this.http
      .get<PokemonTypeListResponse>(`${this.apiUrl}/type?limit=100&offset=0`)
      .pipe(
        map((response) => response.results.map((type: PokemonTypeSummary) => type.name))
      );
  }

  getPokemonById(id: number): Observable<PokemonDetail> {
    return this.loadPokemonDetail(`${this.apiUrl}/pokemon/${id}`);
  }

  getPokemonByName(name: string): Observable<PokemonDetail> {
    return this.loadPokemonDetail(`${this.apiUrl}/pokemon/${name.toLowerCase()}`);
  }

  private loadPokemonDetail(url: string): Observable<PokemonDetail> {
    return this.http
      .get<PokemonApiResponse>(url)
      .pipe(
        switchMap((pokemon) =>
          forkJoin({
            species: this.http.get<PokemonSpeciesResponse>(
              `${this.apiUrl}/pokemon-species/${pokemon.id}`
            ),
            pokemon: of(pokemon)
          })
        ),
        map(({ pokemon, species }) => this.mapPokemonDetail(pokemon, species))
      );
  }

  private mapPokemonDetail(
    pokemon: PokemonApiResponse,
    species: PokemonSpeciesResponse
  ): PokemonDetail {
    return {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types.map((item) => item.type.name),
      abilities: pokemon.abilities.map((item) => ({
        name: item.ability.name,
        isHidden: item.is_hidden
      })),
      description: this.getSpanishDescription(species),
      stats: pokemon.stats.map((item) => ({
        name: item.stat.name,
        baseStat: item.base_stat
      })),
      image: pokemon.sprites.front_default ?? '',
      artwork: pokemon.sprites.other['official-artwork'].front_default ?? ''
    };
  }

  private getSpanishDescription(species: PokemonSpeciesResponse): string {
    const flavorTextEntry = species.flavor_text_entries.find(
      (entry) => entry.language.name === 'es'
    );

    return flavorTextEntry
      ? flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ')
      : '';
  }
}