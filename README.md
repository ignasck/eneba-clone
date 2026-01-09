# Eneba Clone

A full-stack clone of the Eneba marketplace, built with React (Vite) and Node.js (Express, SQLite).

## Features

- **Game Listings:** Browse games with filters (search, fuzzy matching).
- **Game Details:** Eneba-like card design with hover effects, cashback badges, and platform indicators.
- **Cart System:** Add/remove items, update quantities, view total price with service fees calculated.
- **Wishlist:** Toggle wishlist status, view wishlisted games on a dedicated page.
- **Localization:** Switch between English/Lithuanian and EUR/USD (frontend currency conversion).
- **User Management:** Create/Delete users, persist wishlist/cart per session.

## Tech Stack

- **Client:** React, TypeScript, Vite, Axios, Lucide-React (Icons), CSS Modules (Vanilla CSS).
- **Server:** Node.js, Express, SQLite (better-sqlite3), Fuse.js (Fuzzy Search).

## Setup

1.  **Install Dependencies:**
    ```bash
    cd client && npm install
    cd ../server && npm install
    ```

2.  **Start Server:**
    ```bash
    cd server
    node index.js
    ```
    Server runs on `http://localhost:5000`.

3.  **Start Client:**
    ```bash
    cd client
    npm run dev
    ```
    Client runs on `http://localhost:5173`.

## Notes
- Database is a local SQLite file (`server/eneba.db`) initialized on first run.
- Images are served statically from `client/public/images` (or URLs pointing there).
