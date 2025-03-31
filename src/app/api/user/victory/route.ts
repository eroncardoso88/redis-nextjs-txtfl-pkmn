import { db } from "@/db";
import { userVictories } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { pokemonName } = await request.json();

    if (!pokemonName) {
      return NextResponse.json(
        { error: "Pokemon name is required" },
        { status: 400 }
      );
    }

    const existingVictory = await db
      .select()
      .from(userVictories)
      .where(
        and(
          eq(userVictories.userId, userId),
          eq(userVictories.pokemonName, pokemonName.toLowerCase())
        )
      )
      .limit(1);

    if (existingVictory.length > 0) {
      await db
        .update(userVictories)
        .set({
          count: existingVictory[0].count + 1,
          lastDefeated: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(userVictories.userId, userId),
            eq(userVictories.pokemonName, pokemonName.toLowerCase())
          )
        );

      return NextResponse.json({
        success: true,
        message: "Victory count updated",
        count: existingVictory[0].count + 1,
      });
    } else {
      const newVictory = await db
        .insert(userVictories)
        .values({
          userId,
          pokemonName: pokemonName.toLowerCase(),
          count: 1,
          lastDefeated: new Date(),
        })
        .returning();

      return NextResponse.json({
        success: true,
        message: "New victory recorded",
        victory: newVictory[0],
      });
    }
  } catch (error) {
    console.error("Error recording victory:", error);
    return NextResponse.json(
      { error: "Failed to record victory" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const victories = await db
      .select()
      .from(userVictories)
      .where(eq(userVictories.userId, userId))
      .orderBy(userVictories.count, "desc");

    const totalVictories = victories.reduce((sum, v) => sum + v.count, 0);

    return NextResponse.json({
      success: true,
      victories,
      totalVictories,
      uniquePokemonDefeated: victories.length,
    });
  } catch (error) {
    console.error("Error fetching victories:", error);
    return NextResponse.json(
      { error: "Failed to fetch victories" },
      { status: 500 }
    );
  }
}
