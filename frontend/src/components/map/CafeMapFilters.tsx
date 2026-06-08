import type { Cafe } from '@/types/cafe';

type CafeMapFilter = {
  district: string;
  vibe: string;
  price_level: string;
};

type Props = {
  cafes: Cafe[];
  filters: CafeMapFilter;
  onChange: (next: CafeMapFilter) => void;
};

export default function CafeMapFilters({ cafes, filters, onChange }: Props) {
  const districts = Array.from(
    new Set(
      cafes
        .map((c) => c.district)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const vibes = Array.from(
    new Set(
      cafes
        .map((c) => c.vibe)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const priceLevels = Array.from(
    new Set(
      cafes
        .map((c) => c.price_level)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  return (
    <div
      style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}
    >
      <select
        value={filters.district}
        onChange={(e) => onChange({ ...filters, district: e.target.value })}
      >
        <option value="">All Districts</option>
        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>

      <select
        value={filters.vibe}
        onChange={(e) => onChange({ ...filters, vibe: e.target.value })}
      >
        <option value="">All Vibes</option>
        {vibes.map((vibe) => (
          <option key={vibe} value={vibe}>
            {vibe}
          </option>
        ))}
      </select>

      <select
        value={filters.price_level}
        onChange={(e) => onChange({ ...filters, price_level: e.target.value })}
      >
        <option value="">All Prices</option>
        {priceLevels.map((price) => (
          <option key={price} value={price}>
            {price}
          </option>
        ))}
      </select>
    </div>
  );
}
