import type { Cafe } from '@/types/cafe';

export type CafeMapFilter = {
  district: string;
  vibe: string;
  price_level: string;
};

export function filterCafes(cafes: Cafe[], filters: CafeMapFilter): Cafe[] {
  return cafes.filter((cafe) => {
    const matchDistrict =
      !filters.district || cafe.district === filters.district;

    const matchVibe = !filters.vibe || cafe.vibe === filters.vibe;

    const matchPriceLevel =
      !filters.price_level || cafe.price_level === filters.price_level;

    const hasValidLocation =
      typeof cafe.lat === 'number' &&
      typeof cafe.lng === 'number' &&
      !Number.isNaN(cafe.lat) &&
      !Number.isNaN(cafe.lng);

    return matchDistrict && matchVibe && matchPriceLevel && hasValidLocation;
  });
}
