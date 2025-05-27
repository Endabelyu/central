import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { appRouter } from "../../../../packages/trpc";

const trpcRoute = new Hono();

trpcRoute.all("/trpc/:path", async c => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({}),
  });
});

export default trpcRoute;
