"use client";

import type { PokemonDetails } from "@/types/pokemon-details";
import { useEffect, useState } from "react";
import "./moves.scss";

interface MovesTabProps {
  pokemon: PokemonDetails;
}

interface MoveDetails {
  id: number;
  name: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  type: {
    name: string;
  };
  damage_class: {
    name: string;
  };
}

interface ProcessedMove {
  name: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  type: string;
  damageClass: string;
}

export default function MovesTab({ pokemon }: MovesTabProps) {
  const [moves, setMoves] = useState<ProcessedMove[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoveDetails = async (moveUrl: string) => {
      try {
        const response = await fetch(moveUrl);
        const data = await response.json();
        return data as MoveDetails;
      } catch (error) {
        console.error("Error fetching move details:", error);
        return null;
      }
    };

    const fetchMoves = async () => {
      setLoading(true);

      const levelUpMoves = pokemon.moves
        .filter((move) =>
          move.version_group_details.some(
            (detail) => detail.move_learn_method.name === "level-up"
          )
        )
        .slice(0, 6);

      const moveDetailsPromises = levelUpMoves.map((move) =>
        fetchMoveDetails(move.move.url)
      );

      const moveDetailsResults = await Promise.all(moveDetailsPromises);

      console.log(`moveDetailsResults `, moveDetailsResults);

      const processedMoves = moveDetailsResults
        .filter((move) => move !== null)
        .map((move) => ({
          name: formatMoveName(move!.name),
          power: move!.power,
          accuracy: move!.accuracy,
          pp: move!.pp,
          type: move!.type.name,
          damageClass: move!.damage_class.name,
        }));

      console.log(`processedMoves `, processedMoves);
      setMoves(processedMoves);
      setLoading(false);
    };

    fetchMoves();
  }, [pokemon]);

  const leftColumnMoves = moves.slice(0, Math.ceil(moves.length / 2));
  const rightColumnMoves = moves.slice(Math.ceil(moves.length / 2));

  if (loading) {
    return <div className="pokemon-tab moves-tab">Loading moves...</div>;
  }

  return (
    <div className="pokemon-tab moves-tab">
      <div className="moves-container">
        <div className="moves-column">
          {leftColumnMoves.map((move, index) => (
            <div key={index} className="move-category">
              <h4>{move.name}</h4>
              <div className="move-types">
                <span className={`move-type ${move.type}`}>{move.type}</span>
                <span className={`move-type ${move.damageClass}`}>
                  {move.damageClass}
                </span>
              </div>
              <div className="move-stats">
                <div className="move-stat">
                  <span>Pwr</span>
                  <span>{move.power || "-"}</span>
                </div>
                <div className="move-stat">
                  <span>Acc</span>
                  <span>{move.accuracy ? `${move.accuracy}%` : "-"}</span>
                </div>
                <div className="move-stat">
                  <span>PP</span>
                  <span>{move.pp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="moves-column">
          {rightColumnMoves.map((move, index) => (
            <div key={index} className="move-category">
              <h4>{move.name}</h4>
              <div className="move-types">
                <span className={`move-type ${move.type}`}>{move.type}</span>
                <span className={`move-type ${move.damageClass}`}>
                  {move.damageClass}
                </span>
              </div>
              <div className="move-stats">
                <div className="move-stat">
                  <span>Pwr</span>
                  <span>{move.power || "-"}</span>
                </div>
                <div className="move-stat">
                  <span>Acc</span>
                  <span>{move.accuracy ? `${move.accuracy}%` : "-"}</span>
                </div>
                <div className="move-stat">
                  <span>PP</span>
                  <span>{move.pp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatMoveName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
