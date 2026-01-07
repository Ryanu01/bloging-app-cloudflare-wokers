import z, { email } from "zod";

export const userSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string().min(4),
});

export const postSchema = z.object({
  title: z.string(),
  body: z.string(),
});


export const signinSchema = z.object({
  email: z.email(),
  password: z.string() 
})