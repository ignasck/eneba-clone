import React, { useState } from 'react';
import { Gamepad2, Heart, Undo2, MapPin, Bell, Search, ArrowUpDown } from 'lucide-react';
import Fuse from 'fuse.js';

interface Game {
    id: number;
    title: string;
    platform: string;
    region: string;
    price_original: number;
    price_current: number;
    discount: number;
    image_url: string;
    cashback: number;
}

interface WishlistProps {
    games: Game[];
    wishlistSet: Set<number>;
    toggleWishlist: (id: number) => void;
    addToCart: (game: Game) => void;
    formatPrice: (price: number) => string;
    t: any;
}

export const WishlistPage = ({ games, wishlistSet, toggleWishlist, addToCart, formatPrice, t }: WishlistProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter games that are in wishlist
    const wishlistedGames = games.filter(g => wishlistSet.has(g.id));

    // Fuzzy search setup
    const fuse = new Fuse(wishlistedGames, {
        keys: ['title', 'platform'],
        threshold: 0.3,
    });

    const displayedGames = searchTerm
        ? fuse.search(searchTerm).map(result => result.item)
        : wishlistedGames;

    return (
        <div className="wishlist-page">
            <h1 className="page-title">{t.wishlistTitle || "Norų sąrašas"}</h1>

            <div className="wishlist-notification">
                <Bell size={20} />
                <span>{t.wishlistNotification || "Įjunk el. pašto pranešimus, kai sumažės bet kurio pageidaujamo produkto kaina."} <a href="#">{t.login || "Prisijungti"}</a> {t.or || "arba"} <a href="#">{t.register || "Registruotis"}</a></span>
            </div>

            <div className="wishlist-container">
                <div className="wishlist-sidebar">
                    <div className="sidebar-group active">
                        {t.wishlistTitle || "Norų sąrašas"} {wishlistedGames.length} <span className="lock-icon">🔒</span>
                    </div>

                    <div className="sidebar-search-box">
                        <label>{t.itemName || "Prekės pavadinimas"}</label>
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search size={16} />
                        </div>
                    </div>
                </div>

                <div className="wishlist-content">
                    <div className="wishlist-header-row">
                        <div>{t.resultsFound || "Paieškos rezultatai:"} {displayedGames.length}</div>
                        <div className="sort-dropdown">
                            <ArrowUpDown size={16} />
                            {t.sortNewest || "Data: nuo naujausių"}
                        </div>
                    </div>

                    <div className="games-grid wishlist-grid">
                        {displayedGames.map(game => (
                            <div key={game.id} className="game-card">
                                <div className="image-container">
                                    <img
                                        src={game.image_url}
                                        alt={game.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    {game.cashback > 0 && (
                                        <div className="cashback-badge">
                                            <Undo2 size={14} strokeWidth={3} />
                                            <span>{t.cashbackBadge}</span>
                                        </div>
                                    )}
                                    <button
                                        className="wishlist-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist(game.id);
                                        }}
                                        style={{ opacity: 1, transform: 'translateY(0)' }}
                                    >
                                        <Heart
                                            size={20}
                                            className="heart-filled"
                                            strokeWidth={2.5}
                                        />
                                    </button>
                                    <div className="platform-bar">
                                        <Gamepad2 size={16} />
                                        <span>{game.platform}</span>
                                    </div>
                                </div>

                                <div className="card-content">
                                    <div className="card-info-top">
                                        <div className="game-title">{game.title}</div>
                                        <div className="game-region">{game.region}</div>
                                    </div>

                                    <div className="price-section">
                                        <div className="old-price-row">
                                            <span className="price-old">{formatPrice(game.price_original)}</span>
                                            {game.discount > 0 && <span className="discount-text">-{game.discount}%</span>}
                                        </div>
                                        <div className="current-price-row">
                                            <span className="price-current">{formatPrice(game.price_current)}</span>
                                        </div>
                                        {game.cashback > 0 && (
                                            <div className="cashback-text">
                                                {t.cashback}: <span className="cashback-value">{formatPrice(game.cashback)}</span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                                <div className="add-to-cart-wrapper">
                                    <button className="add-to-cart-btn" onClick={() => addToCart(game)}>
                                        {t.addToCart}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
