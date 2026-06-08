import { Coffee, MapPin, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mutate } from 'swr';

import { deleteCafe } from '@/api/cafes';
import CafeSearchBar from '@/components/CafeSearchBar';
import useCafes from '@/hooks/useCafes';
import type { Cafe } from '@/types/cafe';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function getPriceLabel(priceLevel: number | string | null | undefined): string {
  const normalized = Number(priceLevel);

  switch (normalized) {
    case 1:
      return 'Budget';
    case 2:
      return 'Moderate';
    case 3:
      return 'Premium';
    case 4:
      return 'Luxury';
    default:
      return '-';
  }
}

function getFeaturePills(cafe: Cafe): string[] {
  const features: string[] = [];
  if (cafe.wifi) features.push('Wi-Fi');
  if (cafe.quiet) features.push('Quiet');
  if (cafe.study_friendly) features.push('Study');
  if (cafe.nature) features.push('Nature');
  return features;
}

export default function CafeListPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedVibe, setSelectedVibe] = useState<string>('all');
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<string>('all');
  const [page, setPage] = useState<number>(1);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 9,
      district: selectedDistrict !== 'all' ? selectedDistrict : undefined,
      vibe: selectedVibe !== 'all' ? selectedVibe : undefined,
      price_level:
        selectedPriceLevel !== 'all' ? Number(selectedPriceLevel) : undefined,
    }),
    [page, selectedDistrict, selectedVibe, selectedPriceLevel],
  );

  const { cafes, meta, isLoading, error } = useCafes(queryParams);

  const districts = useMemo(() => {
    const values = cafes
      .map((cafe) => cafe.district?.trim())
      .filter((value): value is string => Boolean(value));

    return ['all', ...Array.from(new Set(values))].sort();
  }, [cafes]);

  const vibes = useMemo(() => {
    const values = cafes
      .map((cafe) => cafe.vibe?.trim())
      .filter((value): value is string => Boolean(value));

    return ['all', ...Array.from(new Set(values))].sort();
  }, [cafes]);

  const displayedCafes = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return cafes;

    return cafes.filter((cafe) => {
      return (
        cafe.name?.toLowerCase().includes(keyword) ||
        cafe.district?.toLowerCase().includes(keyword) ||
        cafe.description?.toLowerCase().includes(keyword) ||
        cafe.vibe?.toLowerCase().includes(keyword)
      );
    });
  }, [cafes, search]);

  const handleDelete = async (id: number | string) => {
    const confirmed = window.confirm('Delete this cafe?');
    if (!confirmed) return;

    try {
      await deleteCafe(id);

      await mutate(
        (key) => Array.isArray(key) && key[0] === '/cafes',
        undefined,
        { revalidate: true },
      );
    } catch (err) {
      console.error(err);
      alert('Failed to delete cafe');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-stone-50 via-stone-50 to-amber-50/40">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 overflow-hidden rounded-[2rem] border border-stone-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">
                <Coffee className="h-4 w-4" />
                Chiang Mai cafe data collection
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
                Chiang Mai Cafe Data Explorer
              </h1>

              <p className="mt-4 text-lg leading-8 text-stone-600">
                Explore cafes across Chiang Mai with richer details on vibe,
                features, and location-driven discovery.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-500">
                <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
                  <Sparkles className="h-4 w-4" />
                  {meta.total} cafes total
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
                  <MapPin className="h-4 w-4" />
                  Discover by district
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-start gap-4 lg:w-auto lg:min-w-[320px] lg:items-end">
              <Link to="/cafes/new">
                <Button size="lg" className="rounded-full px-6">
                  Create Cafe
                </Button>
              </Link>
              <Link to="/cafes/map">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-6"
                >
                  View Map
                </Button>
              </Link>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/recommendations')}
              >
                Recommendations
              </Button>

              <div className="flex w-full flex-col gap-3">
                <CafeSearchBar value={search} onChange={setSearch} />

                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setPage(1);
                  }}
                  className="h-11 rounded-full border border-stone-200 bg-white px-4 text-sm text-stone-700 shadow-sm transition outline-none focus:border-stone-400"
                >
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district === 'all' ? 'All districts' : district}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedVibe}
                  onChange={(e) => {
                    setSelectedVibe(e.target.value);
                    setPage(1);
                  }}
                  className="h-11 rounded-full border border-stone-200 bg-white px-4 text-sm text-stone-700 shadow-sm transition outline-none focus:border-stone-400"
                >
                  {vibes.map((vibe) => (
                    <option key={vibe} value={vibe}>
                      {vibe === 'all' ? 'All vibes' : vibe}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedPriceLevel}
                  onChange={(e) => {
                    setSelectedPriceLevel(e.target.value);
                    setPage(1);
                  }}
                  className="h-11 rounded-full border border-stone-200 bg-white px-4 text-sm text-stone-700 shadow-sm transition outline-none focus:border-stone-400"
                >
                  <option value="all">All price levels</option>
                  <option value="1">1 - Budget</option>
                  <option value="2">2 - Moderate</option>
                  <option value="3">3 - Premium</option>
                  <option value="4">4 - Luxury</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-3xl border border-stone-200 bg-white p-8 text-stone-600 shadow-sm">
            Loading cafes...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
            Failed to fetch cafes
          </div>
        )}

        {!isLoading && !error && displayedCafes.length === 0 && (
          <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
              <Coffee className="h-6 w-6 text-stone-500" />
            </div>

            <h2 className="text-2xl font-semibold text-stone-900">
              No cafes found
            </h2>

            <p className="mt-3 text-stone-600">
              Try another keyword or create a new cafe.
            </p>
          </div>
        )}

        {!isLoading && !error && displayedCafes.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {displayedCafes.map((cafe) => (
                <Card
                  key={cafe.id}
                  onClick={() => navigate(`/cafes/${cafe.id}`)}
                  className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border-stone-200 bg-white/90 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative">
                    {cafe.image_url ? (
                      <>
                        <img
                          src={cafe.image_url}
                          alt={cafe.name}
                          className="h-40 w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback instanceof HTMLElement) {
                              fallback.classList.remove('hidden');
                            }
                          }}
                        />
                        <div className="hidden h-40 bg-linear-to-br from-stone-200 via-amber-100 to-stone-100" />
                      </>
                    ) : (
                      <div className="h-40 bg-linear-to-br from-stone-200 via-amber-100 to-stone-100" />
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="line-clamp-2 text-2xl text-stone-950">
                        {cafe.name}
                      </CardTitle>

                      <div className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                        {cafe.rating ? Number(cafe.rating).toFixed(1) : '0.0'}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-5">
                    <p className="line-clamp-3 min-h-[84px] text-sm leading-7 text-stone-600">
                      {cafe.description || 'No description yet'}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700">
                        <MapPin className="h-4 w-4" />
                        {cafe.district}
                      </div>

                      <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700">
                        💸 {getPriceLabel(cafe.price_level)}
                      </div>

                      {cafe.vibe && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-3 py-1.5 text-sm font-medium text-white">
                          ✨ {cafe.vibe}
                        </div>
                      )}
                    </div>

                    <div className="min-h-[40px]">
                      {getFeaturePills(cafe).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {getFeaturePills(cafe).map((feature) => (
                            <div
                              key={feature}
                              className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600"
                            >
                              {feature}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="mt-auto flex flex-wrap gap-2 border-t border-stone-100 pt-5">
                    <Link
                      to={`/cafes/${cafe.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="outline" className="rounded-full">
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      className="rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cafe.id);
                      }}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {meta.total_pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </Button>

                <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm">
                  Page {meta.page} of {meta.total_pages}
                </div>

                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={page >= meta.total_pages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
