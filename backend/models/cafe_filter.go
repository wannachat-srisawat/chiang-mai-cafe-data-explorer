package models

type CafeFilter struct {
	Page       int
	Limit      int
	Offset     int
	District   string
	Vibe       string
	PriceLevel *int
}
