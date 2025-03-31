"use server";

import { getRedisClient } from "@/lib/redis";
import type {
  PokemonCard,
  PokemonDetails,
  PokemonSpecies,
} from "@/types/pokemon-details";
import { NextResponse } from "next/server";

// export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const _params = await params;
  const pokemonName = _params.name.toLowerCase();
  const redis = await getRedisClient();

  try {
    const cachedData = await redis.get(`pokemon:${pokemonName}`);

    console.log(`cachedData `, cachedData);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData));
    }

    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    if (!pokemonResponse.ok) {
      return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
    }

    const pokemonData: PokemonDetails = await pokemonResponse.json();

    console.log(`pokemonData `, pokemonData);

    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}/`
    );

    if (!speciesResponse.ok) {
      return NextResponse.json(
        { error: "Species data not found" },
        { status: 404 }
      );
    }

    const speciesData: PokemonSpecies = await speciesResponse.json();

    console.log(`speciesData `, speciesData);

    const combinedData: PokemonCard = {
      ...pokemonData,
      species_details: {
        color: speciesData.color,
      },
    };

    await redis.set(
      `pokemon:${pokemonName}`,
      JSON.stringify(combinedData),
      "EX",
      86400 // 24HH
    );

    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Pokemon data" },
      { status: 500 }
    );
  }
}
