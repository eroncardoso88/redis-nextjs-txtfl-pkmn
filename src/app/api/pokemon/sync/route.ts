import { db } from '@/db';
import { pokemon } from '@/db/schema';
import type { PokeRegistry } from '@/types/pokemon-details';
import { NextResponse } from 'next/server';

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeRegistry[];
}

export async function POST() {
  try {
    await db.delete(pokemon);
    
    return syncPokemon();
  } catch (error) {
    console.error('Error syncing Pokemon data:', error);
    return NextResponse.json(
      { error: 'Failed to sync Pokemon data' },
      { status: 500 }
    );
  }
}

async function syncPokemon() {
  const allPokemon: { id: number; name: string }[] = [];
  let nextUrl: string | null = 'https://pokeapi.co/api/v2/pokemon?limit=100';
  
  while (nextUrl) {
    const response = await fetch(nextUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon data: ${response.status}`);
    }
    
    const data: PokemonListResponse = await response.json();
    
    const pokemonBatch = data.results.map(pokemon => {
      const urlParts = pokemon.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 2], 10);
      
      return {
        id,
        name: pokemon.name,
      };
    });
    
    allPokemon.push(...pokemonBatch);
    nextUrl = data.next;
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`Fetched ${allPokemon.length} Pokemon from the API`);
  
  if (allPokemon.length > 0) {
    const batchSize = 100;
    for (let i = 0; i < allPokemon.length; i += batchSize) {
      const batch = allPokemon.slice(i, i + batchSize);
      await db.insert(pokemon).values(
        batch.map(p => ({
          id: p.id,
          name: p.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
    }
  }
  
  return NextResponse.json({
    success: true,
    message: `Successfully synced ${allPokemon.length} Pokemon to the database.`,
    count: allPokemon.length,
  });
}