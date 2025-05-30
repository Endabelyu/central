import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { appRouter } from ".";

const trpcRoute = new Hono();

// trpcRoute.all("/trpc/:path", async c => {
//   return fetchRequestHandler({
//     endpoint: "/trpc",
//     req: c.req.raw,
//     router: appRouter,
//     createContext: () => ({}),
//   });
// });

// export default trpcRoute;
// trpc/trpcAdapter.ts

// Match all tRPC procedures: /api/trpc/*
trpcRoute.all("/api/trpc/*", async c => {
  return fetchRequestHandler({
    endpoint: "/api/trpc", // must match the path used on the client
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({}), // customize this if you need auth, etc.
  });
});

export default trpcRoute;
