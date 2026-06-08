import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useCafes from '@/hooks/useCafes';
import type { Cafe } from '@/types/cafe';

type RecommendationMode =
  | 'remote-work'
  | 'study'
  | 'nature'
  | 'budget'
  | 'high-rated';

type ScoredCafe = Cafe & {
  score: number;
  reasons: string[];
};

const modes: {
  key: RecommendationMode;
  title: string;
  description: string;
}[] = [
  {
    key: 'remote-work',
    title: 'Remote Work',
    description: 'Wi-Fi, quiet space, study-friendly, and good rating.',
  },
  {
    key: 'study',
    title: 'Study',
    description: 'Quiet, study-friendly, affordable, and reliable rating.',
  },
  {
    key: 'nature',
    title: 'Nature',
    description: 'Nature-friendly cafes with relaxing atmosphere.',
  },
  {
    key: 'budget',
    title: 'Budget',
    description: 'Affordable cafes with good value signals.',
  },
  {
    key: 'high-rated',
    title: 'High Rated',
    description: 'Cafes ranked mainly by rating quality.',
  },
];

const getPriceScore = (priceLevel: Cafe['price_level']) => {
  const level = String(priceLevel);

  if (level === '$' || level === '1') return 100;
  if (level === '$$' || level === '2') return 75;
  if (level === '$$$' || level === '3') return 45;
  if (level === '$$$$' || level === '4') return 20;

  return 50;
};

const getRatingScore = (rating?: number | null) => {
  if (typeof rating !== 'number') return 50;

  return Math.min(Math.max((rating / 5) * 100, 0), 100);
};

const scoreCafe = (cafe: Cafe, mode: RecommendationMode): ScoredCafe => {
  const ratingScore = getRatingScore(cafe.rating);
  const priceScore = getPriceScore(cafe.price_level);

  const wifiScore = cafe.wifi ? 100 : 0;
  const quietScore = cafe.quiet ? 100 : 0;
  const studyScore = cafe.study_friendly ? 100 : 0;
  const natureScore = cafe.nature ? 100 : 0;

  const reasons: string[] = [];

  if (cafe.wifi) reasons.push('Wi-Fi');
  if (cafe.quiet) reasons.push('Quiet');
  if (cafe.study_friendly) reasons.push('Study friendly');
  if (cafe.nature) reasons.push('Nature');
  if (typeof cafe.rating === 'number') reasons.push(`Rating ${cafe.rating}`);

  let score = 0;

  switch (mode) {
    case 'remote-work':
      score =
        wifiScore * 0.3 +
        quietScore * 0.25 +
        studyScore * 0.25 +
        ratingScore * 0.2;
      break;

    case 'study':
      score =
        quietScore * 0.35 +
        studyScore * 0.35 +
        priceScore * 0.15 +
        ratingScore * 0.15;
      break;

    case 'nature':
      score = natureScore * 0.55 + ratingScore * 0.25 + quietScore * 0.2;
      break;

    case 'budget':
      score =
        priceScore * 0.55 +
        ratingScore * 0.25 +
        wifiScore * 0.1 +
        studyScore * 0.1;
      break;

    case 'high-rated':
      score =
        ratingScore * 0.75 +
        quietScore * 0.1 +
        wifiScore * 0.1 +
        natureScore * 0.05;
      break;

    default:
      score = ratingScore;
  }

  return {
    ...cafe,
    score: Math.round(score),
    reasons,
  };
};

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<RecommendationMode>('remote-work');

  const { cafes, isLoading, error } = useCafes({
    page: 1,
    limit: 1000,
  });

  const recommendedCafes = useMemo(() => {
    return cafes
      .map((cafe) => scoreCafe(cafe, mode))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [cafes, mode]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Loading recommendations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-red-500">
        Failed to load recommendations.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Cafe Recommendations
            </h1>

            <p className="text-sm text-slate-500">
              Find cafes based on work style, study needs, price, nature, and
              rating signals.
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate('/cafes')}>
            Back to List
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {modes.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setMode(item.key)}
              className={`rounded-2xl border p-4 text-left transition ${
                mode === item.key
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <div className="font-semibold">{item.title}</div>
              <div
                className={`mt-1 text-xs ${
                  mode === item.key ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {item.description}
              </div>
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recommendedCafes.map((cafe) => (
            <Card
              key={cafe.id}
              className="overflow-hidden rounded-2xl border shadow-none"
            >
              {cafe.image_url && (
                <img
                  src={cafe.image_url}
                  alt={cafe.name}
                  className="h-40 w-full object-cover"
                />
              )}

              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {cafe.name}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {cafe.district}
                    </div>
                  </div>

                  <div className="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
                    {cafe.score}
                  </div>
                </div>

                <div className="mt-3 line-clamp-2 text-sm text-slate-600">
                  {cafe.description || 'No description'}
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {cafe.reasons.slice(0, 4).map((reason) => (
                    <span
                      key={reason}
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                    >
                      {reason}
                    </span>
                  ))}
                </div>

                <Button
                  className="mt-4 w-full"
                  size="sm"
                  onClick={() => navigate(`/cafes/${cafe.id}`)}
                >
                  View Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
