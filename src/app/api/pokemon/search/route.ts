import { db } from '@/db';
import { pokemon } from '@/db/schema';
import { like, or } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    if (!query || query.length < 3) {
      return NextResponse.json([]);
    }
    
    const searchTerm = `%${query.toLowerCase()}%`;
    
    const results = await db.select({
      id: pokemon.id,
      name: pokemon.name,
    })
    .from(pokemon)
    .where(
      or(
        like(pokemon.name, searchTerm),
        like(pokemon.id, query) 
      )
    )
    .limit(10)
    .orderBy(pokemon.id);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to search Pokemon' },
      { status: 500 }
    );
  }
}