import { createTRPCContext } from "@trpc/tanstack-react-query";
import { createTRPCClient, httpBatchLink, httpLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "@api/src/trpc";

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
export const client = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: "http://localhost:3000/api/trpc",
      // You can pass any HTTP headers you wish here
      // async headers() {
      //   return {
      //     authorization: getAuthCookie(),
      //   };
      // },
    }),
  ],
});
