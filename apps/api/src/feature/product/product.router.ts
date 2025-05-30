import { z } from "zod";
import { publicProcedure, router } from "../../trpc/trpc";
import * as service from "./product.service";
import { GetAllProductsInput } from "./product.schema";

export const productRouter = router({
  getAll: publicProcedure
    .input(GetAllProductsInput)
    .query(async ({ input }) => {
      return service.getAllProducts(
        input.page,
        input.limit,
        input.q,
        input.sort,
        input.category,
      );
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => service.getProductBySlug(input.slug)),
});
