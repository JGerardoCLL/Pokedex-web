export interface PokemonPage {
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
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonTypeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonTypeSummary[];
}

export interface PokemonTypeSummary {
  name: string;
  url: string;
}

export interface PokemonTypeResponse {
  pokemon: {
    pokemon: PokemonListItem;
  }[];
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{
    type: { name: string };
  }>;
  abilities: Array<{
    ability: { name: string };
    is_hidden: boolean;
  }>;
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
  sprites: PokemonSprites;
}

export interface PokemonSprites {
  front_default: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
    };
  };
}

export interface PokemonSpeciesResponse {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
  evolution_chain?: {
    url: string;
  };
}

export interface PokemonEvolutionChainResponse {
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: PokemonEvolutionChainResponse['chain'][];
  };
}
