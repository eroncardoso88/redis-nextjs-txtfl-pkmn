// src/app/pokemon/[name]/page.tsx
"use client";

import PokemonCard from "@/components/pokemon-card";
import ErrorMessage from "@/components/ui/error-message";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { usePokemon } from "@/hooks/use-pokemon";
import { useParams } from "next/navigation";
import "./pokemon-detail.scss";

export default function PokemonDetailPage() {
  const params = useParams();
  const pokemonName = typeof params.name === "string" ? params.name : "";

  const { data, isLoading, error } = usePokemon(pokemonName);

  if (isLoading) {
    return (
      <div className="pokemon-detail-container">
        <LoadingSpinner />
        <p className="loading-text">Loading {pokemonName}...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pokemon-detail-container">
        <ErrorMessage
          title="Could not load Pokémon"
          message={`We couldn't find details for ${pokemonName}. Please try another Pokémon.`}
        />
      </div>
    );
  }

  // Get the Pokémon data
  const pokemon = data;

  return (
    <div className="pokemon-detail-container">
      <div className="pokemon-nav-buttons">
        {/* Previous Pokémon button - would need additional logic to determine prev/next IDs */}
        {pokemon.id > 1 && (
          <a href={`/pokemon/${pokemon.id - 1}`} className="nav-button prev-button">
            ← Previous
          </a>
        )}

        {/* Back to list button */}
        <a href="/" className="nav-button home-button">
          All Pokémon
        </a>

        {/* Next Pokémon button */}
        <a href={`/pokemon/${pokemon.id + 1}`} className="nav-button next-button">
          Next →
        </a>
      </div>
      <div className="pokemon-detail-card">
        <PokemonCard pokemon={pokemon} />
      </div>


    </div>
  );
}