import { createTRPCContext } from "@trpc/tanstack-react-query";
import { httpBatchLink, httpLink } from "@trpc/client";
import type { AppRouter } from "@repo/trpc";
import { QueryClient } from "@tanstack/react-query";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

export const queryClient = new QueryClient();

export const trpcConfig = {
  links: [
    httpLink({
      url: "http://localhost:3000/trpc",
    }),
  ],
};
