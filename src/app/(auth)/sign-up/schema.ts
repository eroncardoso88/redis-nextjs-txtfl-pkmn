import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  passwordConfirmation: z.string().min(8, "Password confirmation is required"),
}).refine(data => data.password === data.passwordConfirmation, { 
  message: "Passwords do not match",
  path: ["passwordConfirmation"], 
});