"use server";

import { unauthenticatedAction } from "@/lib/safe-action";
import { registerUserUseCase } from "@/lib/users";
import { registerSchema } from "./schema";
const afterLoginUrl = "/";

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(registerSchema)
  .handler(async ({ input }) => {
    try {
      console.log(`input `, input);

      const user = await registerUserUseCase(input.email, input.password);

      return { success: true, user };
    } catch (error) {
      console.error("Registration error:", error);

      throw error;
    }
  });
