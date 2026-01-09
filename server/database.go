package main

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func InitDB() {
	var err error
	// Opening the same file as JS version did
	db, err = sql.Open("sqlite3", "./eneba.db")
	if err != nil {
		log.Fatal(err)
	}

	// Create table if not exists
	statement, _ := db.Prepare(`
		CREATE TABLE IF NOT EXISTS games (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT,
			platform TEXT,
			region TEXT,
			price_original REAL,
			price_current REAL,
			discount INTEGER,
			cashback REAL,
			image_url TEXT,
			wishlist_count INTEGER
		)
	`)
	statement.Exec()
}

func GetGames(c *gin.Context) {
	search := c.Query("search")

	// Perform the SQL query with search filter
	rows, err := db.Query("SELECT * FROM games WHERE title LIKE ?", "%"+search+"%")
	if err != nil {
		log.Println("Query error:", err)
		c.JSON(500, gin.H{"error": "Internal server error"})
		return
	}
	defer rows.Close()

	var games []Game = []Game{} // Initialize as empty slice for JSON []
	for rows.Next() {
		var g Game
		err := rows.Scan(
			&g.ID,
			&g.Title,
			&g.Platform,
			&g.Region,
			&g.PriceOriginal,
			&g.PriceCurrent,
			&g.Discount,
			&g.Cashback,
			&g.ImageURL,
			&g.WishlistCount,
		)
		if err != nil {
			log.Println("Row scan error:", err)
			continue
		}
		games = append(games, g)
	}

	c.JSON(200, games)
}
