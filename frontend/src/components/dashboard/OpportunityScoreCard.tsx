import { Card, CardContent } from '@/components/ui/card';
import type { Cafe } from '@/types/cafe';

type Props = {
  cafes: Cafe[];
};

type DistrictScore = {
  district: string;
  cafeCount: number;
  averageRating: number;
  studyFriendlyCount: number;
  natureCount: number;
  wifiCount: number;
  score: number;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getOpportunityScores = (cafes: Cafe[]): DistrictScore[] => {
  const map = new Map<
    string,
    {
      district: string;
      cafeCount: number;
      totalRating: number;
      ratingCount: number;
      studyFriendlyCount: number;
      natureCount: number;
      wifiCount: number;
    }
  >();

  cafes.forEach((cafe) => {
    if (!cafe.district) return;

    const current = map.get(cafe.district) ?? {
      district: cafe.district,
      cafeCount: 0,
      totalRating: 0,
      ratingCount: 0,
      studyFriendlyCount: 0,
      natureCount: 0,
      wifiCount: 0,
    };

    current.cafeCount += 1;

    if (typeof cafe.rating === 'number') {
      current.totalRating += cafe.rating;
      current.ratingCount += 1;
    }

    if (cafe.study_friendly) current.studyFriendlyCount += 1;
    if (cafe.nature) current.natureCount += 1;
    if (cafe.wifi) current.wifiCount += 1;

    map.set(cafe.district, current);
  });

  const stats = Array.from(map.values());
  const maxCafeCount = Math.max(...stats.map((item) => item.cafeCount), 1);

  return stats
    .map((item) => {
      const averageRating =
        item.ratingCount > 0 ? item.totalRating / item.ratingCount : 0;

      const lowDensityScore = 1 - item.cafeCount / maxCafeCount;
      const ratingScore = averageRating / 5;
      const studyScore =
        item.cafeCount > 0 ? item.studyFriendlyCount / item.cafeCount : 0;
      const natureScore =
        item.cafeCount > 0 ? item.natureCount / item.cafeCount : 0;
      const wifiScore =
        item.cafeCount > 0 ? item.wifiCount / item.cafeCount : 0;

      const score =
        lowDensityScore * 45 +
        ratingScore * 20 +
        studyScore * 15 +
        natureScore * 10 +
        wifiScore * 10;

      return {
        district: item.district,
        cafeCount: item.cafeCount,
        averageRating,
        studyFriendlyCount: item.studyFriendlyCount,
        natureCount: item.natureCount,
        wifiCount: item.wifiCount,
        score: Math.round(clamp(score, 0, 100)),
      };
    })
    .sort((a, b) => b.score - a.score);
};

export default function OpportunityScoreCard({ cafes }: Props) {
  const scores = getOpportunityScores(cafes);
  const topArea = scores[0];

  if (!topArea) {
    return null;
  }

  return (
    <Card className="rounded-2xl border shadow-none">
      <CardContent className="p-5">
        <div className="text-sm font-medium text-slate-500">
          Recommended Expansion Area
        </div>

        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {topArea.district}
            </div>

            <div className="mt-1 text-sm text-slate-500">Opportunity Score</div>
          </div>

          <div className="text-4xl font-bold text-slate-900">
            {topArea.score}
            <span className="text-base text-slate-400">/100</span>
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-500"
            style={{ width: `${topArea.score}%` }}
          />
        </div>

        <div className="mt-5 grid gap-3 text-sm md:grid-cols-4">
          <Metric label="Cafe Count" value={topArea.cafeCount} />
          <Metric label="Avg Rating" value={topArea.averageRating.toFixed(1)} />
          <Metric label="Study Friendly" value={topArea.studyFriendlyCount} />
          <Metric label="Nature Cafes" value={topArea.natureCount} />
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          This score favors areas with lower cafe density, solid ratings, and
          work-friendly or nature-friendly cafe signals.
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 font-semibold text-slate-900">{value}</div>
    </div>
  );
}
