"use server";

import { PublicError } from "@/lib/errors";
import { rateLimitByIp } from "@/lib/limiter";
import { getRedisClient } from "@/lib/redis";
import { unauthenticatedAction } from "@/lib/safe-action";
import {
  CUSTOM_SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "@/lib/session";
import { signInUseCase } from "@/lib/users";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { signInSchema } from "./schema";

export const signInAction = unauthenticatedAction
  .createServerAction()
  .input(signInSchema)
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: "sign-in", limit: 5, window: 60000 });

    try {
      const user = await signInUseCase(input.email, input.password);
      const sessionId = uuidv4();
      const sessionData = JSON.stringify({ userId: user.id });
      const redis = await getRedisClient();

      await redis.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        "EX",
        SESSION_DURATION_SECONDS
      );
      console.log(`[signInAction] Session set in Redis for ID: ${sessionId}`);
      const cookieStore = await cookies();
      cookieStore.set(CUSTOM_SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_DURATION_SECONDS,
        sameSite: "lax",
      });
      console.log(`[signInAction] Session cookie set for ID: ${sessionId}`);

      return { success: true };
    } catch (error) {
      if (error instanceof PublicError) {
        throw error;
      }
      console.error("[signInAction] Unexpected error:", error);
      throw new PublicError(
        "An unexpected server error occurred during sign in.",
        "INTERNAL_ERROR"
      );
    }
  });
