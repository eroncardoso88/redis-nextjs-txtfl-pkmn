import { apiClient } from '@/lib/api-client';
import type { PokemonCard } from '@/types/pokemon-details';
import { useQuery } from '@tanstack/react-query';

export const pokemonUtils = {
  getCustomTitle(pokemon: PokemonCard): string {
    return pokemon.name + " #" + String(pokemon.id).padStart(3, "0");
  },
  
  getPrimaryColor(pokemon: PokemonCard): string {
    const colorMap: Record<string, string> = {
      black: "#333333",
      blue: "#3B4CCA",
      brown: "#A0522D",
      gray: "#A4ACAF",
      green: "#4CAF50",
      pink: "#FB5B9C",
      purple: "#A040A0",
      red: "#FF0000",
      white: "#EAEAEA",
      yellow: "#FFDE00"
    };
    
    const colorName = pokemon.species_details?.color?.name || "red";
    return colorMap[colorName] || "#ff5a5f";
  }
};

export function usePokemon(name: string) {
  return useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => apiClient.get<PokemonCard>(`/pokemon/${name}`),
  });
}