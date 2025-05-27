import { Hono } from "hono";

import { cors } from "hono/cors";
import trpcRoute from "./trpc/trpcAdapter";
const app = new Hono();

// app.use("/trpc/*", handleTRPC(appRouter));
app.use(cors());
app.get("/", c => {
  return c.text("Hello Hono!");
});
app.route("/", trpcRoute);

export default app;
