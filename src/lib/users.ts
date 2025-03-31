import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { PublicError } from "./errors";

export async function registerUserUseCase(email: string, password: string) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    throw new PublicError("User with this email already exists", "USER_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = uuidv4();

  await db.insert(users).values({
    id: userId,
    name: email.split("@")[0],
    email,
    hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id: userId,
    email,
  };
}

export async function signInUseCase(email: string, password: string) {
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (userResult.length === 0) {
    throw new PublicError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  const user = userResult[0];

  if (!user.hashedPassword) {
    throw new PublicError("Account has no password set", "INVALID_CREDENTIALS");
  }

  const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

  if (!isValidPassword) {
    throw new PublicError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
