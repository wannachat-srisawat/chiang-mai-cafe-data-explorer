package models

type CreateCafeRequest struct {
	Name          string   `json:"name"`
	Description   string   `json:"description"`
	District      string   `json:"district"`
	ImageURL      string   `json:"image_url"`
	Latitude      *float64 `json:"lat"`
	Longitude     *float64 `json:"lng"`
	Rating        float64  `json:"rating"`
	PriceLevel    int      `json:"price_level"`
	Wifi          bool     `json:"wifi"`
	Quiet         bool     `json:"quiet"`
	StudyFriendly bool     `json:"study_friendly"`
	Nature        bool     `json:"nature"`
	Vibe          string   `json:"vibe"`
}
