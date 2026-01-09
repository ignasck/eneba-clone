# Eneba Marketplace Clone 🎮

A modern, full-stack replica of the Eneba digital marketplace. Built with React and Node.js, this application features a pixel-perfect design, dynamic search, shopping cart functionality, and a wishlist system.

## ✨ Features
- **Dynamic Search**: Real-time fuzzy search for games using Fuse.js integration.
- **Eneba-like UI**: High-fidelity game cards with complex hover animations, cashback badges, and platform overlays.
- **Cart System**: Full shopping cart management with quantity adjustments and automated price/service fee calculations.
- **Wishlist Manager**: Heart items to save them, and view them on a dedicated, filterable wishlist page.
- **Localization**: Frontend-driven settings to switch between English/Lithuanian and EUR/USD (with auto-conversion).
- **User Management**: Support for multiple users with persistent wishlist and cart states.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (via `better-sqlite3`)
- **Search**: Fuse.js (Fuzzy logic)
- **API**: RESTful endpoints (`/list`, `/users`, `/wishlist`)

### Frontend
- **Library**: React 18
- **Language**: TypeScript
- **Tooling**: Vite
- **Styling**: Vanilla CSS (Custom Design System with Variables)
- **Icons**: Lucide-React

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/)

### 1. Running the Backend
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   node index.js
   ```
   *Note: The database (`eneba.db`) will be created and seeded with 10 sample games automatically on the first start.*

### 2. Running the Frontend
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

## 📂 Project Structure
```text
├── server/                 # Node.js Backend
│   ├── index.js            # Express Server & API Routes
│   ├── db.js               # Database Schema & Seeding
│   └── eneba.db            # SQLite Database File
├── client/                 # React Frontend
│   ├── src/
│   │   ├── App.tsx         # Main Logic & Routing
│   │   ├── WishlistPage.tsx# Wishlist Component
│   │   ├── index.css       # Global Styles & Animations
│   │   └── assets/         # Images & SVGs
│   └── public/             # Static Game Images
```

## 📜 Assignment Context
This project was developed as a technical internship assignment. It meets the following requirements:
*   **Content**: Includes required games (Fifa 23, RDR2, Split Fiction) plus additional entries.
*   **Search**: Implements `/list?search=<gamename>` with fuzzy matching.
*   **Stack**: React frontend with a Node.js/SQLite backend.
*   **Design**: Matches the provided visual layout with responsive and interactive elements.

---
Developed by **Ignas** 🚀
