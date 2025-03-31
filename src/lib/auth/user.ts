import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

export async function createUser({ name, email, password }: CreateUserParams) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = uuidv4();

  const newUser = await db
    .insert(users)
    .values({
      id: userId,
      name,
      email,
      hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return {
    id: userId,
    name,
    email,
    createdAt: new Date(),
  };
}
