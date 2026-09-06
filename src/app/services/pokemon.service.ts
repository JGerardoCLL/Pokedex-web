import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, switchMap } from 'rxjs';
import {
  Pokemon,
  PokemonListResponse
} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://pokeapi.co/api/v2';

  getPokemons(limit = 20, offset = 0): Observable<Pokemon[]> {
    return this.http.get<PokemonListResponse>(
      `${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`
    ).pipe(
      switchMap((response) => {
        const requests = response.results.map((pokemon) => {

          const id = this.getPokemonId(pokemon.url);
          return this.getPokemonById(id);
        });
        return forkJoin(requests);
      })
    );
  }

  private getPokemonId(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http
      .get<any>(`${this.apiUrl}/pokemon/${id}`)
      .pipe(
        map((pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.other['official-artwork'].front_default,
          types: pokemon.types.map(
            (item: { type: { name: string } }) => item.type.name
          )
        }))
      );
  }
}