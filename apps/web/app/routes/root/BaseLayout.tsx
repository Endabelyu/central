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

const BaseLayout = () => {
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpLink({
          url: import.meta.env.VITE_BACKEND_URL + "/api/trpc", // Replace with your API URL
        }),
      ],
    }),
  );
  // const { user } = useLoaderData() as Awaited<ReturnType<typeof RootLoader>>;
  return (
    // <CookiesProvider defaultSetOptions={{ path: "/" }}>
    <div className=" min-h-screen  bg-[#f4f4f4]">
      <Outlet />
      <ScrollRestoration />
      <Scripts />
    </div>
    // </CookiesProvider>
  );
};

export default BaseLayout;
