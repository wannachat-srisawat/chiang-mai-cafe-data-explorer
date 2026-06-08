package handlers

import (
	"math"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"

	"backend/models"
	"backend/repositories"
)

type CafeHandler struct {
	CafeRepo *repositories.CafeRepository
}

func NewCafeHandler(cafeRepo *repositories.CafeRepository) *CafeHandler {
	return &CafeHandler{CafeRepo: cafeRepo}
}

func (h *CafeHandler) GetCafes(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "9"))

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 9
	}
	if limit > 50 {
		limit = 50
	}

	offset := (page - 1) * limit

	district := strings.TrimSpace(c.Query("district"))
	vibe := strings.TrimSpace(c.Query("vibe"))
	priceLevelStr := strings.TrimSpace(c.Query("price_level"))

	var priceLevel *int
	if priceLevelStr != "" {
		value, err := strconv.Atoi(priceLevelStr)
		if err == nil {
			priceLevel = &value
		}
	}

	filter := models.CafeFilter{
		Page:       page,
		Limit:      limit,
		Offset:     offset,
		District:   district,
		Vibe:       vibe,
		PriceLevel: priceLevel,
	}

	cafes, err := h.CafeRepo.FindAll(c.Context(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to fetch cafes",
		})
	}

	total, err := h.CafeRepo.Count(c.Context(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to count cafes",
		})
	}

	totalPages := 0
	if total > 0 {
		totalPages = int(math.Ceil(float64(total) / float64(limit)))
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"data":    cafes,
		"meta": fiber.Map{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": totalPages,
		},
	})
}

func (h *CafeHandler) GetCafeByID(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid cafe id",
		})
	}

	cafe, err := h.CafeRepo.FindByID(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "cafe not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
		"data":    cafe,
	})
}

func (h *CafeHandler) CreateCafe(c *fiber.Ctx) error {
	var req models.CreateCafeRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid request body",
		})
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Description = strings.TrimSpace(req.Description)
	req.District = strings.TrimSpace(req.District)
	req.ImageURL = strings.TrimSpace(req.ImageURL)
	req.Vibe = strings.TrimSpace(req.Vibe)

	if req.Name == "" || req.District == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "name and district are required",
		})
	}

	if req.Rating < 0 || req.Rating > 5 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "rating must be between 0 and 5",
		})
	}

	if req.PriceLevel < 1 || req.PriceLevel > 4 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "price_level must be between 1 and 4",
		})
	}

	cafe, err := h.CafeRepo.Create(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to create cafe",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "cafe created successfully",
		"data":    cafe,
	})
}

func (h *CafeHandler) UpdateCafe(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid cafe id",
		})
	}

	var req models.UpdateCafeRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid request body",
		})
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Description = strings.TrimSpace(req.Description)
	req.District = strings.TrimSpace(req.District)
	req.ImageURL = strings.TrimSpace(req.ImageURL)
	req.Vibe = strings.TrimSpace(req.Vibe)

	if req.Name == "" || req.District == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "name and district are required",
		})
	}

	if req.Rating < 0 || req.Rating > 5 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "rating must be between 0 and 5",
		})
	}

	if req.PriceLevel < 1 || req.PriceLevel > 4 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "price_level must be between 1 and 4",
		})
	}

	cafe, err := h.CafeRepo.Update(c.Context(), id, req)
	if err != nil {
		if err.Error() == "cafe not found" {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "cafe not found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to update cafe",
		})
	}

	return c.JSON(fiber.Map{
		"message": "cafe updated successfully",
		"data":    cafe,
	})
}

func (h *CafeHandler) DeleteCafe(c *fiber.Ctx) error {
	id, err := strconv.ParseInt(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid cafe id",
		})
	}

	err = h.CafeRepo.Delete(c.Context(), id)
	if err != nil {
		if err.Error() == "cafe not found" {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "cafe not found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to delete cafe",
		})
	}

	return c.JSON(fiber.Map{
		"message": "cafe deleted successfully",
	})
}
