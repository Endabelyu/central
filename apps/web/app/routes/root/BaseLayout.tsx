// import { queryClient } from "@/lib/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
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

const BaseLayout = () => {
  //   const { user } = useLoaderData() as Awaited<ReturnType<typeof RootLoader>>;
  return (
    // <CookiesProvider defaultSetOptions={{ path: "/" }}>
    <div className=" min-h-screen  bg-[#f4f4f4]">
      {/* <Navbar user={user} /> */}
      {/* <QueryClientProvider client={queryClient}> */}
      <Outlet />
      {/* </QueryClientProvider> */}
      {/* <Footer /> */}
      <ScrollRestoration />
      <Scripts />
    </div>
    // </CookiesProvider>
  );
};

export default BaseLayout;
