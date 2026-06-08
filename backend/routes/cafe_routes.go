package routes

import (
	"github.com/gofiber/fiber/v2"

	"backend/handlers"
)

func RegisterCafeRoutes(api fiber.Router, cafeHandler *handlers.CafeHandler) {
	cafes := api.Group("/cafes")

	cafes.Get("/", cafeHandler.GetCafes)
	cafes.Get("/:id", cafeHandler.GetCafeByID)
	cafes.Post("/", cafeHandler.CreateCafe)
	cafes.Put("/:id", cafeHandler.UpdateCafe)
	cafes.Delete("/:id", cafeHandler.DeleteCafe)
}