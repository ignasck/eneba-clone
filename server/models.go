package main

// Game model corresponding to the database table
type Game struct {
	ID             int     `json:"id" db:"id"`
	Title          string  `json:"title" db:"title"`
	Platform       string  `json:"platform" db:"platform"`
	Region         string  `json:"region" db:"region"`
	PriceOriginal  float64 `json:"price_original" db:"price_original"`
	PriceCurrent   float64 `json:"price_current" db:"price_current"`
	Discount       int     `json:"discount" db:"discount"`
	Cashback       float64 `json:"cashback" db:"cashback"`
	ImageURL       string  `json:"image_url" db:"image_url"`
	WishlistCount  int     `json:"wishlist_count" db:"wishlist_count"`
}
