const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'eneba.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    platform TEXT NOT NULL,
    region TEXT NOT NULL,
    price_original REAL,
    price_current REAL,
    discount INTEGER,
    cashback REAL,
    image_url TEXT,
    wishlist_count INTEGER
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS wishlists (
    user_id INTEGER,
    game_id INTEGER,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, game_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(game_id) REFERENCES games(id)
  );

`);

const seedData = [
  {
    title: 'Fifa 23 EA App Key (PC) GLOBAL',
    platform: 'EA App',
    region: 'GLOBAL',
    price_original: 69.99,
    price_current: 24.93,
    discount: 64,
    cashback: 1.25,
    image_url: '/images/fifa23pc.jpg',
    wishlist_count: 1240
  },
  {
    title: 'Red Dead Redemption 2 Rockstar Key (PC) GLOBAL',
    platform: 'Rockstar',
    region: 'GLOBAL',
    price_original: 59.99,
    price_current: 19.79,
    discount: 67,
    cashback: 0.99,
    image_url: '/images/rdr2pc.jpg',
    wishlist_count: 5420
  },
  {
    title: 'Split Fiction EA App Key (PC) GLOBAL',
    platform: 'EA App',
    region: 'GLOBAL',
    price_original: 49.99,
    price_current: 40.93,
    discount: 18,
    cashback: 4.50,
    image_url: '/images/splitfictionpc.jpg',
    wishlist_count: 626
  },
  {
    title: 'Split Fiction (Xbox Series X|S) XBOX LIVE Key EUROPE',
    platform: 'Xbox Live',
    region: 'EUROPE',
    price_original: 49.99,
    price_current: 34.14,
    discount: 32,
    cashback: 3.76,
    image_url: '/images/splitfictionxbox.jpg',
    wishlist_count: 500
  },
  {
    title: 'Split Fiction (Nintendo Switch 2) eShop Key EUROPE',
    platform: 'Nintendo',
    region: 'EUROPE',
    price_original: 49.99,
    price_current: 36.25,
    discount: 27,
    cashback: 3.99,
    image_url: '/images/splitfictionns2.jpg',
    wishlist_count: 288
  },
  {
    title: 'Elden Ring Steam Key GLOBAL',
    platform: 'Steam',
    region: 'GLOBAL',
    price_original: 59.99,
    price_current: 35.99,
    discount: 40,
    cashback: 1.80,
    image_url: '/images/eldenringpc.jpg',
    wishlist_count: 8500
  },
  {
    title: 'Cyberpunk 2077 GOG Key GLOBAL',
    platform: 'GOG',
    region: 'GLOBAL',
    price_original: 59.99,
    price_current: 29.99,
    discount: 50,
    cashback: 1.50,
    image_url: '/images/cyberpunkgog.jpg',
    wishlist_count: 4200
  },
  {
    title: 'Minecraft Java & Bedrock Edition (PC) Official Website Key GLOBAL',
    platform: 'Mojang',
    region: 'GLOBAL',
    price_original: 29.99,
    price_current: 18.45,
    discount: 38,
    cashback: 1.10,
    image_url: '/images/splitfictionpc.jpg', // Reuse image placeholder
    wishlist_count: 9800
  },
  {
    title: 'God of War Steam Key GLOBAL',
    platform: 'Steam',
    region: 'GLOBAL',
    price_original: 49.99,
    price_current: 24.50,
    discount: 51,
    cashback: 2.15,
    image_url: '/images/rdr2pc.jpg', // Reuse image placeholder
    wishlist_count: 6540
  },
  {
    title: 'Grand Theft Auto V Premium Online Edition Rockstar Key GLOBAL',
    platform: 'Rockstar',
    region: 'GLOBAL',
    price_original: 29.99,
    price_current: 9.99,
    discount: 67,
    cashback: 0.50,
    image_url: '/images/cyberpunkgog.jpg', // Reuse image placeholder
    wishlist_count: 15400
  }
];

const insert = db.prepare(`
  INSERT INTO games (title, platform, region, price_original, price_current, discount, cashback, image_url, wishlist_count)
  VALUES (@title, @platform, @region, @price_original, @price_current, @discount, @cashback, @image_url, @wishlist_count)
`);

// Check and insert seed data if not exists
for (const game of seedData) {
  const exists = db.prepare('SELECT id FROM games WHERE title = ?').get(game.title);
  if (!exists) {
    insert.run(game);
  }
}

module.exports = db;
