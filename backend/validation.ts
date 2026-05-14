import z from "zod";

export const signupValidation = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

export const signinValidation = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
