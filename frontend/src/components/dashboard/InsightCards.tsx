import { Card, CardContent } from '@/components/ui/card';
import type { Cafe } from '@/types/cafe';

type Props = {
  cafes: Cafe[];
};

type DistrictStat = {
  district: string;
  count: number;
  totalRating: number;
  ratingCount: number;
  studyFriendlyCount: number;
};

const getDistrictStats = (cafes: Cafe[]) => {
  const map = new Map<string, DistrictStat>();

  cafes.forEach((cafe) => {
    if (!cafe.district) return;

    const current = map.get(cafe.district) ?? {
      district: cafe.district,
      count: 0,
      totalRating: 0,
      ratingCount: 0,
      studyFriendlyCount: 0,
    };

    current.count += 1;

    if (typeof cafe.rating === 'number') {
      current.totalRating += cafe.rating;
      current.ratingCount += 1;
    }

    if (cafe.study_friendly) {
      current.studyFriendlyCount += 1;
    }

    map.set(cafe.district, current);
  });

  return Array.from(map.values());
};

export default function InsightCards({ cafes }: Props) {
  const stats = getDistrictStats(cafes);

  const mostCompetitive = [...stats].sort((a, b) => b.count - a.count)[0];

  const underserved = [...stats].sort((a, b) => a.count - b.count)[0];

  const bestRated = [...stats]
    .filter((item) => item.ratingCount > 0)
    .sort(
      (a, b) => b.totalRating / b.ratingCount - a.totalRating / a.ratingCount,
    )[0];

  const mostStudyFriendly = [...stats].sort(
    (a, b) => b.studyFriendlyCount - a.studyFriendlyCount,
  )[0];

  const cards = [
    {
      title: 'Most Competitive Area',
      value: mostCompetitive?.district ?? '-',
      description: mostCompetitive
        ? `${mostCompetitive.count} cafes in this district`
        : 'No data available',
    },
    {
      title: 'Underserved Area',
      value: underserved?.district ?? '-',
      description: underserved
        ? `Only ${underserved.count} cafes found`
        : 'No data available',
    },
    {
      title: 'Best Rated Area',
      value: bestRated?.district ?? '-',
      description: bestRated
        ? `Average rating ${(bestRated.totalRating / bestRated.ratingCount).toFixed(1)}`
        : 'No rating data',
    },
    {
      title: 'Study-Friendly Area',
      value: mostStudyFriendly?.district ?? '-',
      description: mostStudyFriendly
        ? `${mostStudyFriendly.studyFriendlyCount} study-friendly cafes`
        : 'No data available',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="rounded-2xl border shadow-none">
          <CardContent className="p-5">
            <div className="text-sm font-medium text-slate-500">
              {card.title}
            </div>

            <div className="mt-2 text-xl font-bold text-slate-900">
              {card.value}
            </div>

            <div className="mt-1 text-sm text-slate-500">
              {card.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
