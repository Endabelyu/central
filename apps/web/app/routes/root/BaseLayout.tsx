// import { queryClient } from "@/lib/trpc";
import type { AppRouter } from "@trpc/index";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
// import Navbar from "../../components/shared/navbar";
// import Footer from "../../components/shared/footer";
// import { RootLoader } from "./root-loader";
// import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, httpLink } from "@trpc/client";
import { useState } from "react";
import { TRPCProvider } from "~/lib/trpc";
// function makeQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         // With SSR, we usually want to set some default staleTime
//         // above 0 to avoid refetching immediately on the client
//         staleTime: 60 * 1000,
//       },
//     },
//   });
// }
// let browserQueryClient: QueryClient | undefined = undefined;
// function getQueryClient() {
//   if (typeof window === "undefined") {
//     // Server: always make a new query client
//     return makeQueryClient();
//   } else {
//     // Browser: make a new query client if we don't already have one
//     // This is very important, so we don't re-make a new client if React
//     // suspends during the initial render. This may not be needed if we
//     // have a suspense boundary BELOW the creation of the query client
//     if (!browserQueryClient) browserQueryClient = makeQueryClient();
//     return browserQueryClient;
//   }
// }
const BaseLayout = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpLink({
          url: "http://localhost:3000/api/trpc", // Replace with your API URL
        }),
      ],
    }),
  );
  // const { user } = useLoaderData() as Awaited<ReturnType<typeof RootLoader>>;
  return (
    // <CookiesProvider defaultSetOptions={{ path: "/" }}>
    <div className=" min-h-screen  bg-[#f4f4f4]">
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <Outlet />
        </TRPCProvider>
      </QueryClientProvider>
      <ScrollRestoration />
      <Scripts />
    </div>
    // </CookiesProvider>
  );
};

export default BaseLayout;
