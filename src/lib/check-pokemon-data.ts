import { db } from '@/db';
import { pokemon } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function hasPokemonData(): Promise<boolean> {
  try {
    const [countResult] = await db.select({
      count: sql<number>`count(*)`
    })
    .from(pokemon)

    const count = Number(countResult.count);
    return count > 0;
  } catch (error) {
    console.error('Error checking Pokemon data:', error);
    return false;
  }
}