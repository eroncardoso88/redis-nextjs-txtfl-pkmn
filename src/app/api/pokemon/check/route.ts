import { hasPokemonData } from '@/lib/check-pokemon-data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await hasPokemonData()
    
    return NextResponse.json({
      hasData: result
    });
  } catch (error) {
    console.error('Error checking Pokemon data:', error);
    return NextResponse.json(
      { error: 'Failed to check Pokemon data' },
      { status: 500 }
    );
  }
}