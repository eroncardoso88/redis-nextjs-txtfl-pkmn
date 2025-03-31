"use client";

import type { PokemonDetails } from "@/types/pokemon-details";
import "./pokemon-type.scss";

export interface PokemonType {
  pokemon: PokemonDetails;
}

const get = {
  customTitle(pokemon: PokemonDetails): string {
    return pokemon.name + " #" + String(pokemon.id).padStart(3, "0");
  },
};

export default function PokemonTypes({ pokemon }: PokemonType) {
  return (
    <div className="poketype__wrapper">
      {pokemon.types?.map((typeInfo) => (
        <div className="poketype__container" key={typeInfo.type.url}>
          <div
            
            className="poketype__label"
          >
            {typeInfo.type.name}
          </div>
        </div>
      ))}
    </div>
  );
}
