"use client";

import type { PokemonDetails } from "@/types/pokemon-details";
import { getStat } from "@/util/poke-details";
import "./status.scss";

interface StatusTabProps {
  pokemon: PokemonDetails;
}

export default function StatusTab({ pokemon }: StatusTabProps) {
  const stats = {
    hp: getStat(pokemon, "hp"),
    attack: getStat(pokemon, "attack"),
    defense: getStat(pokemon, "defense"),
    specialAttack: getStat(pokemon, "special-attack"),
    specialDefense: getStat(pokemon, "special-defense"),
    speed: getStat(pokemon, "speed")
  };

  const getPercentage = (value: number) => `${(value / 150) * 100}%`;

  return (
    <div className="pokemon-tab status-tab">
      <div className="stat-bars">
        <div className="stat-row">
          <span className="stat-label">HP</span>
          <div className="stat-bar-container">
            <div className="stat-bar hp-bar" style={{ width: getPercentage(stats.hp) }}></div>
          </div>
          <span className="stat-value">{stats.hp}</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">ATK</span>
          <div className="stat-bar-container">
            <div className="stat-bar atk-bar" style={{ width: getPercentage(stats.attack) }}></div>
          </div>
          <span className="stat-value">{stats.attack}</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">DEF</span>
          <div className="stat-bar-container">
            <div className="stat-bar def-bar" style={{ width: getPercentage(stats.defense) }}></div>
          </div>
          <span className="stat-value">{stats.defense}</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">SATK</span>
          <div className="stat-bar-container">
            <div className="stat-bar satk-bar" style={{ width: getPercentage(stats.specialAttack) }}></div>
          </div>
          <span className="stat-value">{stats.specialAttack}</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">SDEF</span>
          <div className="stat-bar-container">
            <div className="stat-bar sdef-bar" style={{ width: getPercentage(stats.specialDefense) }}></div>
          </div>
          <span className="stat-value">{stats.specialDefense}</span>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">SPD</span>
          <div className="stat-bar-container">
            <div className="stat-bar spd-bar" style={{ width: getPercentage(stats.speed) }}></div>
          </div>
          <span className="stat-value">{stats.speed}</span>
        </div>
      </div>
    </div>
  );
}