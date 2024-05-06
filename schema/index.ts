import { z } from "zod"
 
export const signupSchema = z.object({
  name: z.string().min(1 , "Name is required").max(50),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required")
})

export const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required")
})