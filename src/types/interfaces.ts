export interface IPokemonUrl {
  name: string;
  url: string;
}

export interface IPokemonType {
  slot: number;
  type: IPokemonUrl;
}

export interface IPokemonCardData {
  id: number;
  name: string;
  image: string;
  types: string[];
}

interface IPokemonAbility {
  ability: IPokemonUrl;
  is_hidden: boolean;
  slot: number;
}

interface IPokemonStat {
  base_stat: number;
  effort: number;
  stat: IPokemonUrl;
}

interface IPokemonSprite {
  front_default: string | null;
}

export interface IPokemon {
  abilities: IPokemonAbility[];
  base_experience: number;
  cries: {
    latest: string;
    legacy: string | null;
  };
  forms: {
    name: string;
    url: string;
  }[];
  height: number;
  weight: number;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  name: string;
  order: number;
  species: IPokemonUrl;
  sprites: IPokemonSprite;
  stats: IPokemonStat[];
  types: IPokemonType[];
}
