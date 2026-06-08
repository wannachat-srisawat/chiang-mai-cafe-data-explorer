package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"

	"backend/handlers"
	"backend/repositories"
)

func SetupRoutes(app *fiber.App, db *pgxpool.Pool) {
	api := app.Group("/api")

	cafeRepo := repositories.NewCafeRepository(db)
	cafeHandler := handlers.NewCafeHandler(cafeRepo)

	RegisterCafeRoutes(api, cafeHandler)
}