export interface IPokemonItem {
  name: string;
  url: string;
}

export interface IPokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface IPokemonCardData {
  id: number;
  name: string;
  image: string;
  types: string[];
}
