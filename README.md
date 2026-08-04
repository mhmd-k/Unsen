# Unsen 🛍️

Unsen is a full-stack, multi-vendor e-commerce platform built from scratch with **React (TypeScript)** on the frontend and **Node.js / Express** on the backend. It supports three user roles (**Customer**, **Seller**, **Admin**), a full storefront-to-checkout flow, a seller dashboard with sales analytics and invoicing, and secure JWT-based authentication with refresh tokens.

**Live demo:**
- 🖥️ Frontend: [unsen-frontend.onrender.com](https://unsen-frontend.onrender.com)
- ⚙️ Backend API: [unsen.onrender.com](https://unsen.onrender.com)

> Hosted on Render's free tier — the backend may take up to a minute to spin up on the first request after a period of inactivity.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Key Concepts & Features](#key-concepts--features)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Deployment](#deployment)

---

## Overview

Unsen simulates a real-world online marketplace. Customers can browse products, add them to a cart or wishlist, check out, and track their orders. Sellers can list and manage their own products, view sales analytics, and generate invoices. The project was built to practice production-oriented patterns: relational data modeling, transactional business logic, token-based auth with silent refresh, role-based access control, and a componentized, type-safe frontend.

## Tech Stack

**Frontend**
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool & dev server
- [React Router v7](https://reactrouter.com/) — client-side routing
- [TanStack Query (React Query)](https://tanstack.com/query) — server state, caching & data fetching
- [Zustand](https://zustand-demo.pmnd.rs/) — client state (cart, wishlist), with `persist` middleware for localStorage
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — form state and schema validation
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) — styling & accessible UI components
- [Axios](https://axios-http.com/) — HTTP client with request/response interceptors
- [Recharts](https://recharts.org/) — analytics charts for the seller dashboard
- [Embla Carousel](https://www.embla-carousel.com/) — product carousels
- [Sonner](https://sonner.emilkowal.ski/) — toast notifications

**Backend**
- [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)
- [Sequelize](https://sequelize.org/) ORM on **MySQL** — the primary relational datastore
- [Aiven for MySQL](https://aiven.io/) — managed cloud database hosting
- [JWT](https://jwt.io/) (`jsonwebtoken`) — access & refresh token authentication
- [bcrypt](https://www.npmjs.com/package/bcrypt) — password hashing
- [express-validator](https://express-validator.github.io/) — request validation
- [Cloudinary](https://cloudinary.com/) + [Multer](https://www.npmjs.com/package/multer) + [streamifier](https://www.npmjs.com/package/streamifier) — in-memory image uploads streamed directly to the cloud
- [Nodemailer](https://nodemailer.com/) — transactional emails (verification, password reset)

**Infrastructure**
- [Render](https://render.com/) — hosting for both the static frontend and the Node backend
- Aiven for MySQL — managed cloud-hosted relational database

---

## Key Concepts & Features

### Authentication & Authorization
- **Access/refresh token pattern**: short-lived JWT access tokens (1h) are sent in the `Authorization: Bearer` header, while a long-lived refresh token (14d) is stored in an `httpOnly`, `Secure`, `SameSite=None` cookie — never exposed to JavaScript.
- **Silent token refresh**: an Axios instance (`apiPrivate`) is wrapped in a custom `useAxiosPrivate` hook that attaches the access token to every request and transparently retries a request with a fresh token if the server responds `401/403`, using a `useRefreshToken` hook that calls `/api/auth/refresh`.
- **Role-based access control (RBAC)**: three roles — `CUSTOMER`, `SELLER`, `ADMIN`. On the backend, a `requireRoleMiddleware` guards specific routes; on the frontend, `RolePageGuard`/`RoleComponentGuard` components and a route-level `ProtectedRoute` gate pages and UI by role.
- **Email verification & password reset**: signup issues a verification token emailed via Nodemailer; a similar token-based flow powers "forgot password."
- Passwords are hashed with **bcrypt**; sensitive routes are protected by a JWT-verification middleware that parses the `Authorization` header.

### Data & Business Logic
- **Relational schema with Sequelize**, including one-to-one, one-to-many, and many-to-many associations (e.g., `User` ⇄ `Product` via seller, `Product` ⇄ `Order` through an `OrderItem` join table, `Product` ⇄ `User` many-to-many for wishlists).
- **Database transactions** (`sequelize.transaction()`) protect multi-step writes so they succeed or roll back atomically — used when placing an order (validates stock, computes totals, decrements inventory) and when processing a payment (creates a payment record, marks the order paid, and generates both a customer invoice and per-seller invoices in one atomic operation).
- **Simulated payment processing**: a payment endpoint mimics what an integration with a provider like Stripe would do, without depending on a third-party payment API.
- **Automatic invoice generation**: paying for an order fans out into a single customer invoice and one invoice per seller involved in that order, splitting revenue by seller.
- **Seller analytics dashboard**: a single endpoint runs several parallel aggregate SQL queries (`SUM`, `COUNT`, `GROUP BY`, `DATE_FORMAT`) to compute total revenue, order counts, items sold, a 12-month revenue/orders time series (with gap-filling for months with no sales), top-selling products, and an order-status breakdown.
- **Cursor-free pagination middleware**: a reusable Express middleware paginates any Sequelize model given a page/limit query and an optional dynamic `where` clause.
- **Image upload pipeline**: product images are uploaded via `multer` (in-memory buffer) and streamed straight to Cloudinary with `streamifier`, avoiding temp files on disk; sellers can add, delete, and reassign a "primary" image per product.

### Frontend Architecture
- **Client/server state separation**: TanStack Query owns all server data (fetching, caching, invalidation), while Zustand owns local UI/client state (cart contents, wishlist), keeping the two concerns decoupled.
- **Persistent cart**: the cart store uses Zustand's `persist` middleware to survive page reloads via `localStorage`.
- **Centralized Axios layer**: a public `api` client (no credentials) and a private `apiPrivate` client (`withCredentials: true`, auto-attached bearer token, auto-refresh-on-401) split public and authenticated traffic.
- **Type-safe API contracts**: shared TypeScript types for `User`, `Product`, `Order`, `Invoice`, etc. keep the API responses and UI components in sync.
- **Composable, accessible UI**: built on Radix UI primitives via shadcn/ui (dialogs, dropdowns, accordions, tooltips, navigation menus) styled with Tailwind CSS v4.
- **Form validation** with React Hook Form + Zod resolvers for signup, login, checkout, and product forms.
- **Route-based code organization** with nested layouts (`Layout`, `AuthLayout`, `SellerDashboardLayout`) and role-guarded nested routes for the seller dashboard.

### Storefront & Commerce Features
- Product catalog with search/category browsing, product detail pages, and related-product suggestions.
- Shopping cart, wishlist, and a multi-step checkout flow (address → payment → confirmation).
- Order history and order detail views for customers.
- Seller dashboard: product CRUD, sales analytics with charts, and invoice management.


## Data Model

Core entities and relationships (see `docs/ERD_diagram.drawio` for the full diagram):

- **User** — has one `SellerBankAccount` (if a seller), many `EmailLog`s, many `Product`s (if a seller), many `Order`s, and many `Product`s via `Wishlist` (many-to-many).
- **Product** — belongs to a seller (`User`), has many `OrderItem`s.
- **Order** — belongs to a `User`, has many `OrderItem`s, one `CustomerInvoice`, many `SellerInvoice`s, and many `Payment`s.
- **OrderItem** — join entity between `Order` and `Product`, storing quantity and unit price at time of purchase.
- **Payment** — records a payment attempt/result against an `Order`.
- **CustomerInvoice / SellerInvoice** — generated automatically after a successful payment; seller invoices are split per seller based on which products were purchased.
- **Wishlist** — join table for the `User` ⇄ `Product` many-to-many relationship.

## Project Structure

```
Unsen/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, CORS, Cloudinary configuration
│   │   ├── constants/       # Shared constants (roles, etc.)
│   │   ├── controllers/     # Route handlers / business logic
│   │   │   └── auth/        # Login, registration, password controllers
│   │   ├── middleware/      # Auth, role guard, pagination, validation
│   │   ├── models/          # Sequelize models + associations
│   │   ├── routes/          # Express routers per resource
│   │   ├── services/        # Email service (Nodemailer)
│   │   ├── utils/           # JWT helpers
│   │   ├── validations/     # express-validator schemas
│   │   └── index.js         # App entry point
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instances
│   │   ├── components/      # Reusable UI, layout, guards, charts
│   │   ├── contexts/        # AuthContext
│   │   ├── hooks/           # Custom hooks (auth, data-fetching, refresh)
│   │   ├── lib/             # API helpers, constants, utils
│   │   ├── pages/           # Route-level page components
│   │   │   └── seller-dashboard/
│   │   ├── stores/          # Zustand stores (cart, wishlist)
│   │   ├── types/           # Shared TypeScript types
│   │   ├── router.tsx        # React Router route tree
│   │   └── main.tsx
│   └── index.html
└── docs/                    # ERD & use-case diagrams
```

---

## API Overview

All routes are mounted under `/api` on the backend.

| Base Path | Responsibility |
|---|---|
| `/api/auth` | Signup, login, logout, email verification, refresh token, password reset |
| `/api/products` | Product listing (paginated), details, related products, seller product CRUD, image management |
| `/api/orders` | Placing orders, order history, order details |
| `/api/payment` | Simulated payment processing (creates payment + invoices) |
| `/api/wishlist` | Add/remove/list wishlist items |
| `/api/seller` | Seller sales analytics |
| `/api/seller/invoices` | Seller invoice list & details |

Protected routes require a valid `Authorization: Bearer <accessToken>` header; seller-only routes are additionally gated by role.

---

## Deployment

Both services are deployed on **Render**:
- The **frontend** is built (`npm run build`) and deployed as a static site.
- The **backend** is deployed as a Node web service, connected to a managed MySQL database, with the environment variables listed above configured in the Render dashboard.

CORS on the backend is restricted to an explicit allow-list (`backend/src/config/allowedOrigins.js`) that includes both the local dev URLs and the production frontend URL.
