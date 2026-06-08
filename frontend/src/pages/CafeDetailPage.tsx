import {
  BookOpen,
  Clock3,
  Coffee,
  Leaf,
  MapPin,
  Navigation,
  Sparkles,
  Star,
  VolumeX,
  Wallet,
  Wifi,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { mutate } from 'swr';

import { deleteCafe } from '@/api/cafes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useCafe from '@/hooks/useCafe';

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

export default function CafeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cafe, isLoading, error } = useCafe(id);

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm('Delete this cafe?');
    if (!confirmed) return;

    try {
      await deleteCafe(id);

      await mutate(
        (key) => Array.isArray(key) && key[0] === '/cafes',
        undefined,
        { revalidate: true },
      );

      navigate('/cafes');
    } catch (err) {
      console.error(err);
      alert('Failed to delete cafe');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-stone-50 via-stone-50 to-amber-50/40">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-stone-600">Loading cafe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="min-h-screen bg-linear-to-b from-stone-50 via-stone-50 to-amber-50/40">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">
            Cafe not found
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => navigate('/cafes')}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const createdAt = cafe.created_at
    ? new Date(cafe.created_at).toLocaleString()
    : '-';

  const features = [
    { label: 'Wi-Fi', active: cafe.wifi, icon: Wifi },
    { label: 'Quiet', active: cafe.quiet, icon: VolumeX },
    { label: 'Study Friendly', active: cafe.study_friendly, icon: BookOpen },
    { label: 'Nature', active: cafe.nature, icon: Leaf },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-stone-50 via-stone-50 to-amber-50/40">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">
              <Coffee className="h-4 w-4" />
              Cafe detail
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-stone-950">
              {cafe.name}
            </h1>

            <p className="mt-2 text-stone-600">
              Explore the vibe, features, and location insight for this cafe.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to={`/cafes/${cafe.id}/edit`}>
              <Button className="rounded-full">Edit</Button>
            </Link>

            <Button
              variant="destructive"
              className="rounded-full"
              onClick={handleDelete}
            >
              Delete
            </Button>

            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => navigate('/cafes')}
            >
              Back
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden rounded-[2rem] border-stone-200 bg-white/90 shadow-sm">
          <div className="relative">
            {cafe.image_url ? (
              <>
                <img
                  src={cafe.image_url}
                  alt={cafe.name}
                  className="h-72 w-full object-cover sm:h-96"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback instanceof HTMLElement) {
                      fallback.classList.remove('hidden');
                    }
                  }}
                />
                <div className="hidden h-72 bg-linear-to-br from-stone-200 via-amber-100 to-stone-100 sm:h-96" />
              </>
            ) : (
              <div className="h-72 bg-linear-to-br from-stone-200 via-amber-100 to-stone-100 sm:h-96" />
            )}
          </div>

          <CardContent className="space-y-8 p-8">
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">
                <MapPin className="h-4 w-4" />
                {cafe.district || '-'}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                <Star className="h-4 w-4" />
                {cafe.rating ? Number(cafe.rating).toFixed(1) : '0.0'} / 5
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">
                <Wallet className="h-4 w-4" />
                {getPriceLabel(cafe.price_level)}
              </div>

              {cafe.vibe && (
                <div className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white">
                  <Sparkles className="h-4 w-4" />
                  {cafe.vibe}
                </div>
              )}

              <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">
                <Clock3 className="h-4 w-4" />
                {createdAt}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div>
                  <h2 className="text-lg font-semibold text-stone-950">
                    Description
                  </h2>
                  <p className="mt-3 leading-8 text-stone-600">
                    {cafe.description || 'No description yet.'}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-stone-950">
                    Features
                  </h2>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {features.map((feature) => {
                      const Icon = feature.icon;

                      return (
                        <div
                          key={feature.label}
                          className={`flex items-center gap-4 rounded-2xl border p-5 ${
                            feature.active
                              ? 'border-stone-900 bg-stone-900 text-white'
                              : 'border-stone-200 bg-stone-50 text-stone-400'
                          }`}
                        >
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                              feature.active ? 'bg-white/15' : 'bg-white'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="text-base font-semibold">
                              {feature.label}
                            </p>
                            <p
                              className={`text-sm ${
                                feature.active
                                  ? 'text-stone-300'
                                  : 'text-stone-500'
                              }`}
                            >
                              {feature.active ? 'Available' : 'Not marked'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                  <h3 className="text-sm font-semibold tracking-wide text-stone-500 uppercase">
                    Quick info
                  </h3>

                  <div className="mt-4 space-y-4 text-sm text-stone-600">
                    <div>
                      <p className="font-medium text-stone-900">Cafe name</p>
                      <p>{cafe.name || '-'}</p>
                    </div>

                    <div>
                      <p className="font-medium text-stone-900">District</p>
                      <p>{cafe.district || '-'}</p>
                    </div>

                    <div>
                      <p className="font-medium text-stone-900">Vibe</p>
                      <p>{cafe.vibe || '-'}</p>
                    </div>

                    <div>
                      <p className="font-medium text-stone-900">Rating</p>
                      <p>
                        {cafe.rating ? Number(cafe.rating).toFixed(1) : '0.0'}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-stone-900">Price level</p>
                      <p>{getPriceLabel(cafe.price_level)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-5">
                  <h3 className="text-sm font-semibold tracking-wide text-stone-500 uppercase">
                    Location
                  </h3>

                  <div className="mt-4 space-y-4 text-sm text-stone-600">
                    <div className="flex items-start gap-3">
                      <Navigation className="mt-0.5 h-4 w-4 text-stone-500" />
                      <div>
                        <p className="font-medium text-stone-900">Latitude</p>
                        <p>
                          {cafe.lat !== null && cafe.lat !== undefined
                            ? cafe.lat
                            : '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Navigation className="mt-0.5 h-4 w-4 text-stone-500" />
                      <div>
                        <p className="font-medium text-stone-900">Longitude</p>
                        <p>
                          {cafe.lng !== null && cafe.lng !== undefined
                            ? cafe.lng
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {cafe.lat !== null &&
                  cafe.lat !== undefined &&
                  cafe.lng !== null &&
                  cafe.lng !== undefined && (
                    <a
                      href={`https://www.google.com/maps?q=${cafe.lat},${cafe.lng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="outline" className="w-full rounded-xl">
                        Open in Maps
                      </Button>
                    </a>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
