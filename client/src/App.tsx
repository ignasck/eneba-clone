import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css'
import axios from 'axios';
import { Gamepad2, Heart, Undo2, Trash2, Info } from 'lucide-react';
import logo from './assets/logoFull.svg';
import cartIcon from './assets/cart.svg';
import wishlistIcon from './assets/wishlist.svg';
import { WishlistPage } from './WishlistPage';

// Jei esame localhost, naudojame port 5000, jei ne - naudojame santykinį kelią
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : '';

axios.defaults.baseURL = API_BASE;

const translations = {
    lt: {
        searchPlaceholder: "Ieškoti žaidimų...",
        resultsFound: "Rasta rezultatų:",
        noGames: "Prijunk backendą, kad pamatytum žaidimus!",
        settingsTitle: "Atnaujink nustatymus",
        settingsSubtitle: "Nustatyk pageidaujamą regioną, kalbą ir valiutą.",
        region: "Regionas",
        language: "Kalba",
        currency: "Valiuta",
        cancel: "Atšaukti",
        save: "Išsaugoti",
        addUser: "+ Pridėti vartotoją",
        addToCart: "Pridėti į krepšelį",
        cashback: "grįžta",
        cashbackBadge: "GRĮŽTA",
        myCart: "Mano pirkinių krepšelis",
        emptyCart: "Pirkinių krepšelis yra tuščias",
        emptyCartSub: "Panašu, kad dar nepasirinkai prekių",
        digitalItem: "Skaitmeninė prekė",
        serviceFee: "Aptarnavimo mokestis",
        total: "Iš viso",
        viewCart: "Peržiūrėti krepšelį",
        checkout: "Atsiskaityti dabar",
        wishlistTitle: "Norų sąrašas",
        wishlistNotification: "Įjunk el. pašto pranešimus, kai sumažės bet kurio pageidaujamo produkto kaina.",
        login: "Prisijungti",
        register: "Registruotis",
        or: "arba",
        itemName: "Prekės pavadinimas",
        sortNewest: "Data: nuo naujausių"
    },
    en: {
        searchPlaceholder: "Search for games...",
        resultsFound: "Results found:",
        noGames: "Connect backend to see games!",
        settingsTitle: "Update settings",
        settingsSubtitle: "Set your preferred region, language and currency.",
        region: "Region",
        language: "Language",
        currency: "Currency",
        cancel: "Cancel",
        save: "Save",
        addUser: "+ Add User",
        addToCart: "Add to cart",
        cashback: "back",
        cashbackBadge: "CASHBACK",
        myCart: "My shopping cart",
        emptyCart: "Shopping cart is empty",
        emptyCartSub: "Looks like you haven't chosen items yet",
        digitalItem: "Digital product",
        serviceFee: "Service fee",
        total: "Total",
        viewCart: "View cart",
        checkout: "Checkout now",
        wishlistTitle: "Wishlist",
        wishlistNotification: "Turn on email notifications when price drops for any product you desire.",
        login: "Login",
        register: "Register",
        or: "or",
        itemName: "Item Name",
        sortNewest: "Date: newest first"
    }
};

const currencies = {
    EUR: { symbol: '€', rate: 1 },
    USD: { symbol: '$', rate: 1.08 }
};

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

interface User {
    id: number;
    name: string;
}

interface CartItem {
    game: Game;
    quantity: number;
}

function App() {
    const navigate = useNavigate();
    const [games, setGames] = useState<Game[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [wishlistedGames, setWishlistedGames] = useState<Set<number>>(new Set());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [language, setLanguage] = useState<'lt' | 'en'>('lt');
    const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');

    // Cart State
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Temporary states for modal
    const [tempLang, setTempLang] = useState(language);
    const [tempCurr, setTempCurr] = useState(currency);

    // Notification State
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

    const showNotification = (message: string, type: 'error' | 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const t = translations[language];
    const curr = currencies[currency];

    const formatPrice = (price: number) => {
        return `${curr.symbol}${(price * curr.rate).toFixed(2)}`;
    };

    const addToCart = (game: Game) => {
        setCart(prev => {
            const existing = prev.find(item => item.game.id === game.id);
            if (existing) {
                return prev.map(item => item.game.id === game.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { game, quantity: 1 }];
        });
        setIsCartOpen(true); // Open cart when added
    };

    const decreaseQuantity = (gameId: number) => {
        setCart(prev => {
            const existing = prev.find(item => item.game.id === gameId);
            if (existing && existing.quantity > 1) {
                return prev.map(item => item.game.id === gameId ? { ...item, quantity: item.quantity - 1 } : item);
            }
            // Jei kiekis 1, pašaliname prekę
            return prev.filter(item => item.game.id !== gameId);
        });
    };

    const removeFromCart = (gameId: number) => {
        setCart(prev => prev.filter(item => item.game.id !== gameId));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.game.price_current * item.quantity), 0);
    const cashbackTotal = cart.reduce((sum, item) => sum + (item.game.cashback * item.quantity), 0);

    const fetchWishlist = async (userId: number) => {
        try {
            const res = await axios.get(`/wishlist/${userId}`);
            setWishlistedGames(new Set(res.data));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        axios.get('/users').then(res => setUsers(res.data));
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchWishlist(currentUser.id);
        } else {
            setWishlistedGames(new Set());
        }
    }, [currentUser]);

    const handleCreateUser = async () => {
        if (users.length >= 5) {
            showNotification("Maximum 5 users allowed!", 'error');
            return;
        }
        const name = prompt("Enter new user name:");
        if (name) {
            const res = await axios.post('/users', { name });
            setUsers([...users, res.data]);
            setCurrentUser(res.data);
            setShowUserDropdown(false);
            showNotification(`User ${name} created!`, 'success');
        }
    };

    const handleDeleteUser = async (e: React.MouseEvent, userId: number) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
            if (currentUser && currentUser.id === userId) {
                setCurrentUser(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleWishlist = async (id: number) => {
        if (!currentUser) {
            showNotification("Please select a user to add items to wishlist!", 'error');
            setShowUserDropdown(true); // Auto-open dropdown
            return;
        }

        try {
            const res = await axios.post('/wishlist/toggle', {
                userId: currentUser.id,
                gameId: id
            });

            setWishlistedGames(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        axios.get(`/list?search=${searchTerm}`)
            .then(response => setGames(response.data))
            .catch(error => console.error(error));
    }, [searchTerm]);

    return (
        <div className="container">
            <header>
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src={logo} alt="Eneba Logo" style={{ height: '40px' }} />
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="lang-selector" onClick={() => {
                    setTempLang(language);
                    setTempCurr(currency);
                    setIsSettingsOpen(true);
                }}>
                    <img
                        src={language === 'lt' ? "https://flagcdn.com/w40/lt.png" : "https://flagcdn.com/w40/gb.png"}
                        alt="Flag"
                        className="flag-icon"
                    />
                    <span>{language === 'lt' ? "Lietuvių" : "English"} | {currency}</span>
                </button>

                <div className="header-actions">
                    <div className="user-dropdown-container">
                        <button className="user-avatar" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                            {currentUser ? currentUser.name[0].toUpperCase() : "?"}
                        </button>

                        {showUserDropdown && (
                            <div className="user-dropdown">
                                {users.map(u => (
                                    <div key={u.id} className="dropdown-item user-item" onClick={() => {
                                        setCurrentUser(u);
                                        setShowUserDropdown(false);
                                    }}>
                                        <span>{u.name} {currentUser?.id === u.id && "✓"}</span>
                                        <button className="delete-user-btn" onClick={(e) => handleDeleteUser(e, u.id)}>×</button>
                                    </div>
                                ))}
                                <div className="dropdown-item add-user" onClick={handleCreateUser}>
                                    {t.addUser}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="icon-button" onClick={() => navigate('/wishlist')}>
                        <img src={wishlistIcon} alt="Wishlist" />
                        {wishlistedGames.size > 0 && <span className="cart-badge">{wishlistedGames.size}</span>}
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button className="icon-button" onClick={() => setIsCartOpen(!isCartOpen)}>
                            <img src={cartIcon} alt="Cart" />
                            {cart.length > 0 && <span className="cart-badge">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
                        </button>

                        {isCartOpen && (
                            <>
                                <div className="cart-overlay-bg" onClick={() => setIsCartOpen(false)}></div>
                                <div className="cart-dropdown">
                                    <div className="cart-header">
                                        <h3>{t.myCart}</h3>
                                        <button className="close-cart" onClick={() => setIsCartOpen(false)}>×</button>
                                    </div>

                                    {cart.length === 0 ? (
                                        <div className="empty-cart-state">
                                            <div className="info-circle">
                                                <Info size={32} />
                                            </div>
                                            <h4>{t.emptyCart}</h4>
                                            <p>{t.emptyCartSub}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="cart-items">
                                                {cart.map(item => (
                                                    <div key={item.game.id} className="cart-item">
                                                        <img src={item.game.image_url} alt={item.game.title} className="cart-item-img" />
                                                        <div className="cart-item-info">
                                                            <div className="cart-item-publisher">{item.game.platform}</div>
                                                            <div className="cart-item-title">{item.game.title}</div>
                                                            <div className="cart-item-type">
                                                                <span>{t.digitalItem}</span>
                                                                <div className="help-icon">?</div>
                                                            </div>
                                                            <div className="cart-item-controls">
                                                                <span className="qty-control" onClick={() => decreaseQuantity(item.game.id)}>-</span>
                                                                <span className="qty-value">{item.quantity}</span>
                                                                <span className="qty-control" onClick={() => addToCart(item.game)}>+</span>
                                                            </div>
                                                        </div>
                                                        <div className="cart-item-price-col">
                                                            <button className="delete-item" onClick={() => removeFromCart(item.game.id)}>
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <div className="cart-item-price">{formatPrice(item.game.price_current * item.quantity)}</div>
                                                            {item.game.cashback > 0 && (
                                                                <div className="cart-item-cashback">{t.cashback}: {formatPrice(item.game.cashback * item.quantity)}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="cart-footer">
                                                <div className="cart-summary-row">
                                                    <span>{t.serviceFee}:</span>
                                                    <span>-- <span className="help-icon">?</span></span>
                                                </div>
                                                <div className="cart-total-row">
                                                    <span>{t.total}</span>
                                                    <div className="total-right">
                                                        <span className="total-price">{formatPrice(cartTotal)}</span>
                                                        {cashbackTotal > 0 && <span className="total-cashback">{t.cashback}: {formatPrice(cashbackTotal)}</span>}
                                                    </div>
                                                </div>
                                                <button className="view-cart-btn">{t.viewCart}</button>
                                                <button className="checkout-btn">{t.checkout}</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={
                        <>
                            <div className="results-count">{t.resultsFound} {games.length}</div>
                            <div className="games-grid">
                                {games.map(game => (
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
                                            >
                                                <Heart
                                                    size={20}
                                                    className={wishlistedGames.has(game.id) ? "heart-filled" : ""}
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

                                            <div className="card-footer">
                                                <div className="wishlist-count" onClick={() => toggleWishlist(game.id)}>
                                                    <Heart
                                                        size={16}
                                                        className={wishlistedGames.has(game.id) ? "heart-active" : ""}
                                                        fill={wishlistedGames.has(game.id) ? "currentColor" : "none"}
                                                    />
                                                    <span>{game.id * 42 + (wishlistedGames.has(game.id) ? 1 : 0)}</span>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="add-to-cart-wrapper">
                                            <button className="add-to-cart-btn" onClick={() => addToCart(game)}>
                                                {t.addToCart}
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {games.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>{t.noGames}</div>}
                            </div>
                        </>
                    } />
                    <Route path="/wishlist" element={
                        <WishlistPage
                            games={games}
                            wishlistSet={wishlistedGames}
                            toggleWishlist={toggleWishlist}
                            addToCart={addToCart}
                            formatPrice={formatPrice}
                            t={t}
                        />
                    } />
                </Routes>
            </main>

            {notification && (
                <div className="toast-container">
                    <div className={`toast-message ${notification.type}`}>
                        {notification.type === 'error' ? <Info size={20} /> : <Gamepad2 size={20} />}
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}

            {isSettingsOpen && (
                <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setIsSettingsOpen(false)}>×</button>

                        <h2 className="modal-title">{t.settingsTitle}</h2>
                        <p className="modal-subtitle">{t.settingsSubtitle}</p>

                        <div className="settings-group">
                            <label className="settings-label">{t.region}</label>
                            <select className="settings-select">
                                <option>🇱🇹 Lietuva</option>
                                <option>🌍 Global</option>
                                <option>🇪🇺 Europe</option>
                            </select>
                        </div>

                        <div className="settings-group">
                            <label className="settings-label">{t.language}</label>
                            <select
                                className="settings-select"
                                value={tempLang}
                                onChange={(e) => setTempLang(e.target.value as 'lt' | 'en')}
                            >
                                <option value="lt">Lietuvių</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        <div className="settings-group">
                            <label className="settings-label">{t.currency}</label>
                            <select
                                className="settings-select"
                                value={tempCurr}
                                onChange={(e) => setTempCurr(e.target.value as 'EUR' | 'USD')}
                            >
                                <option value="EUR">Euras (€)</option>
                                <option value="USD">Doleris ($)</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setIsSettingsOpen(false)}>{t.cancel}</button>
                            <button className="btn-save" onClick={() => {
                                setLanguage(tempLang);
                                setCurrency(tempCurr);
                                setIsSettingsOpen(false);
                            }}>{t.save}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
