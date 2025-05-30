import { z } from "zod";

export const GetAllProductsInput = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  q: z.string().optional().default(""),
  sort: z.enum(["asc", "desc"]).optional().default("asc"),
  category: z.string().optional().default("Android"),
});
export type GetAllProductsInputType = z.infer<typeof GetAllProductsInput>;
