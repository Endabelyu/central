import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("product/:slug", "routes/product.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("test", "routes/test.tsx"),
] satisfies RouteConfig;
