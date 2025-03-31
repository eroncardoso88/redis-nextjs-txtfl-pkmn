'use client';

import { PokemonSearch } from '@/components/pokemon-search';
import { PokeballIcon } from '@/components/ui/pk-icons';
import type { PokemonSearchResult } from '@/hooks/use-pokemon-search';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import './home_styles.scss';

export default function HomePage() {
  const router = useRouter();
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonSearchResult | null>(null);
  
  const handleSelectPokemon = (pokemon: PokemonSearchResult) => {
    setSelectedPokemon(pokemon);
    router.push(`/pokemon/${pokemon.name}`);
  };
  
  return (
    <div className="home-page__container">
      <div className="home-page__content">
        <div className="home-page__header">
          <div className="home-page__logo">
            <PokeballIcon />
          </div>
          <h1 className="home-page__title">Pokémon Explorer</h1>
          <p className="home-page__subtitle">
            Search for Pokémon to see detailed information
          </p>
        </div>
        
        <div className="home-page__search-container">
          <PokemonSearch onSelect={handleSelectPokemon} />
        </div>
        
        <div className="home-page__instructions">
          <p>Type at least 3 characters to search for Pokémon</p>
        </div>
      </div>
    </div>
  );
}