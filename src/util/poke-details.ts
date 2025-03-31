import type { PokemonDetails } from "@/types/pokemon-details";


export function getMovesOfType(pokemon: PokemonDetails, types: string[]): Array<{name: string, power: number, accuracy: number, pp: number}> {
  return [
    { name: "Thunder Shock", power: 40, accuracy: 100, pp: 30 },
    { name: "Quick Attack", power: 40, accuracy: 100, pp: 30 }
  ].filter((_, index) => index < types.length);
}

export function getStat(pokemon: PokemonDetails, statName: string): number {
  const stat = pokemon.stats.find(s => s.stat.name === statName);
  return stat ? stat.base_stat : 0;
}

export function getStrongAgainstTypes(types: Array<{type: {name: string}}>) {
  console.log(`types `, types)
  const typeAdvantages: Record<string, string[]> = {
    "grass": ["water", "ground", "rock"],
    "poison": ["grass", "fairy"],
    "fire": ["grass", "ice", "bug", "steel"],
    "water": ["fire", "ground", "rock"],
    "electric": ["water", "flying"],
  };

  const strongAgainst: string[] = [];
  
  types.forEach(typeObj => {
    const typeName = typeObj.type.name;
    if (typeAdvantages[typeName]) {
      typeAdvantages[typeName].forEach(advantage => {
        if (!strongAgainst.includes(advantage)) {
          strongAgainst.push(advantage);
        }
      });
    }
  });
  
  return strongAgainst;
}