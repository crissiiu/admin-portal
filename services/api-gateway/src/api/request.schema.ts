import { z } from "zod";

export const bearerTokenSchema = z.string().startsWith("Bearer ");
