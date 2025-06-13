import { z } from "zod";

export const signInSchema = z.object({
    identifier:z.string(), // we can also call it 'username' if needed.
    password:z.string()
})