package repositories

import (
	"context"
	"errors"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"

	"backend/models"
)

type CafeRepository struct {
	DB *pgxpool.Pool
}

func NewCafeRepository(db *pgxpool.Pool) *CafeRepository {
	return &CafeRepository{DB: db}
}

func (r *CafeRepository) FindAll(ctx context.Context, filter models.CafeFilter) ([]models.Cafe, error) {
	query := `
		SELECT
			id,
			name,
			description,
			district,
			COALESCE(image_url, ''),
			latitude,
			longitude,
			COALESCE(rating, 0),
			COALESCE(price_level, 1),
			COALESCE(wifi, false),
			COALESCE(quiet, false),
			COALESCE(study_friendly, false),
			COALESCE(nature, false),
			COALESCE(vibe, ''),
			created_at
		FROM cafes
		WHERE 1=1
	`

	args := []any{}
	argPos := 1

	if filter.District != "" {
		query += " AND district = $" + strconv.Itoa(argPos)
		args = append(args, filter.District)
		argPos++
	}

	if filter.Vibe != "" {
		query += " AND vibe = $" + strconv.Itoa(argPos)
		args = append(args, filter.Vibe)
		argPos++
	}

	if filter.PriceLevel != nil {
		query += " AND price_level = $" + strconv.Itoa(argPos)
		args = append(args, *filter.PriceLevel)
		argPos++
	}

	query += " ORDER BY id DESC"
	query += " LIMIT $" + strconv.Itoa(argPos)
	args = append(args, filter.Limit)
	argPos++

	query += " OFFSET $" + strconv.Itoa(argPos)
	args = append(args, filter.Offset)

	rows, err := r.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cafes := []models.Cafe{}
	for rows.Next() {
		var cafe models.Cafe
		if err := rows.Scan(
			&cafe.ID,
			&cafe.Name,
			&cafe.Description,
			&cafe.District,
			&cafe.ImageURL,
			&cafe.Latitude,
			&cafe.Longitude,
			&cafe.Rating,
			&cafe.PriceLevel,
			&cafe.Wifi,
			&cafe.Quiet,
			&cafe.StudyFriendly,
			&cafe.Nature,
			&cafe.Vibe,
			&cafe.CreatedAt,
		); err != nil {
			return nil, err
		}
		cafes = append(cafes, cafe)
	}

	return cafes, rows.Err()
}

func (r *CafeRepository) Count(ctx context.Context, filter models.CafeFilter) (int, error) {
	query := `SELECT COUNT(*) FROM cafes WHERE 1=1`

	args := []any{}
	argPos := 1

	if filter.District != "" {
		query += " AND district = $" + strconv.Itoa(argPos)
		args = append(args, filter.District)
		argPos++
	}

	if filter.Vibe != "" {
		query += " AND vibe = $" + strconv.Itoa(argPos)
		args = append(args, filter.Vibe)
		argPos++
	}

	if filter.PriceLevel != nil {
		query += " AND price_level = $" + strconv.Itoa(argPos)
		args = append(args, *filter.PriceLevel)
		argPos++
	}

	var total int
	err := r.DB.QueryRow(ctx, query, args...).Scan(&total)
	return total, err
}

func (r *CafeRepository) FindByID(ctx context.Context, id int64) (*models.Cafe, error) {
	var cafe models.Cafe

	err := r.DB.QueryRow(ctx, `
		SELECT
			id,
			name,
			description,
			district,
			COALESCE(image_url, ''),
			latitude,
			longitude,
			COALESCE(rating, 0),
			COALESCE(price_level, 1),
			COALESCE(wifi, false),
			COALESCE(quiet, false),
			COALESCE(study_friendly, false),
			COALESCE(nature, false),
			COALESCE(vibe, ''),
			created_at
		FROM cafes
		WHERE id = $1
	`, id).Scan(
		&cafe.ID,
		&cafe.Name,
		&cafe.Description,
		&cafe.District,
		&cafe.ImageURL,
		&cafe.Latitude,
		&cafe.Longitude,
		&cafe.Rating,
		&cafe.PriceLevel,
		&cafe.Wifi,
		&cafe.Quiet,
		&cafe.StudyFriendly,
		&cafe.Nature,
		&cafe.Vibe,
		&cafe.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &cafe, nil
}

func (r *CafeRepository) Create(ctx context.Context, req models.CreateCafeRequest) (*models.Cafe, error) {
	var cafe models.Cafe

	err := r.DB.QueryRow(ctx, `
		INSERT INTO cafes (
			name,
			description,
			district,
			image_url,
			latitude,
			longitude,
			rating,
			price_level,
			wifi,
			quiet,
			study_friendly,
			nature,
			vibe
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING
			id,
			name,
			description,
			district,
			COALESCE(image_url, ''),
			latitude,
			longitude,
			COALESCE(rating, 0),
			COALESCE(price_level, 1),
			COALESCE(wifi, false),
			COALESCE(quiet, false),
			COALESCE(study_friendly, false),
			COALESCE(nature, false),
			COALESCE(vibe, ''),
			created_at
	`,
		req.Name,
		req.Description,
		req.District,
		req.ImageURL,
		req.Latitude,
		req.Longitude,
		req.Rating,
		req.PriceLevel,
		req.Wifi,
		req.Quiet,
		req.StudyFriendly,
		req.Nature,
		req.Vibe,
	).Scan(
		&cafe.ID,
		&cafe.Name,
		&cafe.Description,
		&cafe.District,
		&cafe.ImageURL,
		&cafe.Latitude,
		&cafe.Longitude,
		&cafe.Rating,
		&cafe.PriceLevel,
		&cafe.Wifi,
		&cafe.Quiet,
		&cafe.StudyFriendly,
		&cafe.Nature,
		&cafe.Vibe,
		&cafe.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &cafe, nil
}

func (r *CafeRepository) Update(ctx context.Context, id int64, req models.UpdateCafeRequest) (*models.Cafe, error) {
	cmdTag, err := r.DB.Exec(ctx, `
		UPDATE cafes
		SET
			name = $1,
			description = $2,
			district = $3,
			image_url = $4,
			latitude = $5,
			longitude = $6,
			rating = $7,
			price_level = $8,
			wifi = $9,
			quiet = $10,
			study_friendly = $11,
			nature = $12,
			vibe = $13
		WHERE id = $14
	`,
		req.Name,
		req.Description,
		req.District,
		req.ImageURL,
		req.Latitude,
		req.Longitude,
		req.Rating,
		req.PriceLevel,
		req.Wifi,
		req.Quiet,
		req.StudyFriendly,
		req.Nature,
		req.Vibe,
		id,
	)
	if err != nil {
		return nil, err
	}

	if cmdTag.RowsAffected() == 0 {
		return nil, errors.New("cafe not found")
	}

	return r.FindByID(ctx, id)
}

func (r *CafeRepository) Delete(ctx context.Context, id int64) error {
	cmdTag, err := r.DB.Exec(ctx, `
		DELETE FROM cafes
		WHERE id = $1
	`, id)
	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return errors.New("cafe not found")
	}

	return nil
}
