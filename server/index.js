const express = require('express');
const cors = require('cors');
const db = require('./db');
const Fuse = require('fuse.js');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React client build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Main list and search endpoint
app.get('/list', (req, res) => {
    const { search } = req.query;

    try {
        const allGames = db.prepare('SELECT * FROM games').all();
        if (!search) {
            res.json(allGames);
            return;
        }
        const fuse = new Fuse(allGames, {
            keys: ['title', 'platform', 'region'],
            threshold: 0.3,

        })
        const results = fuse.search(search);
        res.json(results.map(r => r.item));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Users endpoints
app.get('/users', (req, res) => {
    try {
        const users = db.prepare('SELECT * FROM users').all();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/users', (req, res) => {
    const { name } = req.body;
    try {
        const result = db.prepare('INSERT INTO users (name) VALUES (?)').run(name);
        res.json({ id: result.lastInsertRowid, name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    try {
        // Delete user's wishlist first
        db.prepare('DELETE FROM wishlists WHERE user_id = ?').run(id);
        // Delete user
        db.prepare('DELETE FROM users WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Wishlist endpoints
app.get('/wishlist/:userId', (req, res) => {
    const { userId } = req.params;
    try {
        const wishlist = db.prepare('SELECT game_id FROM wishlists WHERE user_id = ?').all(userId);
        res.json(wishlist.map(row => row.game_id));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/wishlist/toggle', (req, res) => {
    const { userId, gameId } = req.body;
    try {
        const exists = db.prepare('SELECT 1 FROM wishlists WHERE user_id = ? AND game_id = ?').get(userId, gameId);

        if (exists) {
            db.prepare('DELETE FROM wishlists WHERE user_id = ? AND game_id = ?').run(userId, gameId);
            res.json({ added: false });
        } else {
            db.prepare('INSERT INTO wishlists (user_id, game_id) VALUES (?, ?)').run(userId, gameId);
            res.json({ added: true });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Handle React routing, return all requests to React app
app.get('(.*)', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
