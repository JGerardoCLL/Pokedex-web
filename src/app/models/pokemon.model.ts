export interface PokemonPage{
    count: number;
    next: string | null;
    previous: string | null;
    results: Pokemon[];
}

export interface Pokemon {
    id: number;
    name: string;
    image: string;
    types: string[];
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonStat {
  name: string;
  baseStat: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: PokemonAbility[];
  description: string;
  stats: PokemonStat[];
  image: string;
  artwork: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}