# Central

This project build with Turborepo.

## Using this example

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: React web application with React Router 7
- `api`: Hono API with [trpc](https://trpc.io)
- `@repo/trpc`: reusable trpc router for the project
- `@repo/schema`:reusable schema for the project
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [bun](https://bun.sh/) for fast, lightweight dev environments

### Develop

To develop all apps and packages, run the following command:

## Install dependencies

```
cd central
bun install
```

## Write the env file

```
cp .env.example .env
```

## Doing prisma migration and running seed

```
cd apps/api
bun run migrate
bun seed
```

## Install run development server

```
**Do this in root folder**
bun run dev
```

### Build

To build all apps and packages, run the following command:

```
cd central
bun run build
```

## Web application

The web application is inside the apps/web folder.

# Features

- Showing list of products with pagination , search and filters
- Showing product details page with images, variant, storage, model, price, ram for inquire product

# List Pages

List all pages in the Central Web application.

- / - This route is the home page of the application.
- /:slug - This route is for displaying the details of a specific product.
- /register - This route is used to register a new account.
- /login - This route is used to login to an existing account.

# Tech Stack and Dependencies

- Language: TypeScript
- Runtime: Bun
- Framework/Library: React
- Routing: React Router 7
- CSS Framework: Tailwind CSS
- Components Library: Shadcn UI
- deployment: Netlify [Central](https://central.endabelyu.com)

## API

The API is inside the apps/api folder.

# List Routes

List all routes in the Central API.

```
base route : /api/trpc
```

- getAll - This route for getting all products.
- getBySlug - This route for getting a product by slug.

# Tech Stack and Dependencies

- Language: TypeScript
- Runtime: Bun
- Framework/Library: Hono
- Routing: React Router 7
- validation: Zod
- Database: Prisma ORM && Neon Postgresql
- deployment: Render [Central-api](https://api-central.endabelyu.com)

## A short write-up in the README explaining decisions made during the development process, including challenges you encountered and how they were resolved.

- during development process is the most important part of the project because its my first time using trpc as api layer , so i must learn how to use it and how to make it work with prisma ORM and Neon Postgresql plus how to integrate it with Web apps to make it work. its take so much time but i finally make it work. and i almost forgot to using react router 7 framework mode so in the middle of the development i have to change the framework to react router 7 framework mode, but i dont have much time left, so i served at my best to finish the project according to the objectives.
