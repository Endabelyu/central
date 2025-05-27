import { productRouter } from "../../apps/api/src/feature/product/product.router";
import { router } from "../../apps/api/src/trpc/trpc";

export const appRouter = router({
  product: productRouter,
});

export type AppRouter = typeof appRouter;
