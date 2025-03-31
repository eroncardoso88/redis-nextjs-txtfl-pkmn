"use client";

import type { PokemonDetails } from "@/types/pokemon-details";
import { getStrongAgainstTypes } from "@/util/poke-details";
import { } from "lucide-react";
import "./about.scss";

interface AboutTabProps {
  pokemon: PokemonDetails;
}


export default function AboutTab({ pokemon }: AboutTabProps) {
  console.log(`pokemon `, pokemon)
  const description = pokemon.species?.url ? 
    `"It has small electric sacs on both its cheeks. If threatened, it looses electric charges from the sacs." - Dawn's Pokédex` : 
    "No description available.";
  
  const heightInMeters = pokemon.height / 10;
  const heightInFeet = Math.floor(heightInMeters * 3.23);
  const heightInInches = Math.round((heightInMeters * 3.28 - heightInFeet) * 12);
  const heightDisplay = `${heightInFeet}'${heightInInches}"`;
  
  const weightInKg = pokemon.weight / 10
  const weightInLbs = (weightInKg * 2.2).toFixed(1);
  
  const strongAgainst = getStrongAgainstTypes(pokemon.types);

  return (
    <div className="pokemon-tab about-tab">
      <p className="description">{description}</p>
      
      <div className="stats-grid">
        <div className="stat-row">
          <span className="stat-label">Height</span>
          <span className="stat-value">{heightDisplay}</span>
          <span className="stat-alt-value">{heightInMeters.toFixed(1)} m</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Weight</span>
          <span className="stat-value">{weightInLbs} lbs</span>
          <span className="stat-alt-value">{weightInKg.toFixed(1)} kg</span>
        </div>
        
        <div className="stat-row strong-against">
          <span className="stat-label">Strong against</span>
          <div className="type-icons">
            {strongAgainst.map((type, index) => (
              <div key={index} className={`type-icon ${type.toLowerCase()}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
