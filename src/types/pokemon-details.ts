export interface PokemonDetails {
  abilities: Ability[]
  base_experience: number
  cries: Cries
  forms: PokeRegistry[]
  game_indices: Index[]
  height: number
  held_items: HeldItem[]
  id: number
  is_default: boolean
  location_area_encounters: string
  moves: Mfe[]
  name: string
  order: number
  past_abilities: any[]
  past_types: any[]
  species: PokeRegistry
  sprites: Sprites
  stats: Stat[]
  types: Type[]
  weight: number
}

export interface PokemonSpecies {
  color: PokeRegistry
}

export interface PokemonCard extends PokemonDetails {
  species_details: PokemonSpecies;
}

export interface Ability {
  ability: PokeRegistry
  is_hidden: boolean
  slot: number
}

export interface Cries {
  latest: string
  legacy: string
}

export interface Index {
  game_index: number
  version: PokeRegistry
}

export interface HeldItem {
  item: PokeRegistry
  version_details: VersionDetail[]
}

export interface VersionDetail {
  rarity: number
  version: PokeRegistry
}

export interface Mfe {
  move: PokeRegistry
  version_group_details: VersionGroupDetail[]
}

export interface VersionGroupDetail {
  level_learned_at: number
  move_learn_method: PokeRegistry
  order?: number
  version_group: PokeRegistry
}


export interface Sprites {
  back_default: string
  back_female: string
  back_shiny: string
  back_shiny_female: string
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
  other: unknown
  versions: unknown
}

export interface Stat {
  base_stat: number
  effort: number
  stat: PokeRegistry
}

export interface Type {
  slot: number
  type: PokeRegistry
}

export interface PokeRegistry {
  name: string
  url: string
}