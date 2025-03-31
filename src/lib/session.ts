import { db } from "@/db";
import { users } from "@/db/schema";
import { getRedisClient } from "@/lib/redis";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { AuthenticationError } from "./errors";

export const runtime = 'nodejs'; 

export const CUSTOM_SESSION_COOKIE_NAME = "app_session_id";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24;

interface CustomSessionData {
  userId: string;
}

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function getSession(): Promise<{ user: SessionUser } | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CUSTOM_SESSION_COOKIE_NAME)?.value;
  
  if (!sessionId) {
    return null;
  }
  
  try {
    const redis = await getRedisClient();
    const data = await redis.get(`session:${sessionId}`);
    
    if (!data) {
      return null;
    }
    
    const sessionData = JSON.parse(data) as CustomSessionData;
    
    if (!sessionData?.userId) {
      console.error("Invalid session data found in Redis:", sessionData);
      return null;
    }
    
    const [dbUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, sessionData.userId));
      
    if (!dbUser) {
      console.error(
        `User with ID ${sessionData.userId} not found in DB, but session exists.`
      );
      return null;
    }
    
    return {
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
      },
    };
  } catch (error) {
    console.error("Failed to get session from Redis or DB:", error);
    return null;
  }
}

export async function assertAuthenticated(): Promise<SessionUser> {
  const session = await getSession();
  
  if (!session?.user?.id) {
    throw new AuthenticationError();
  }
  
  return session.user;
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  const redis = await getRedisClient();
  
  const sessionData: CustomSessionData = {
    userId,
  };
  

  await redis.set(
    `session:${sessionId}`, 
    JSON.stringify(sessionData), 
    'EX', 
    SESSION_DURATION_SECONDS
  );
  
  return sessionId;
}

export async function destroySession(sessionId: string): Promise<void> {
  const redis = await getRedisClient();
  await redis.del(`session:${sessionId}`);
}