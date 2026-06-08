import { Card, CardContent } from '@/components/ui/card';
import type { Cafe } from '@/types/cafe';

type Props = {
  cafes: Cafe[];
};

const getAverageRating = (cafes: Cafe[]) => {
  const ratings = cafes
    .map((cafe) => cafe.rating)
    .filter((rating): rating is number => typeof rating === 'number');

  if (ratings.length === 0) return '-';

  const average =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

  return average.toFixed(1);
};

const getMostCommonDistrict = (cafes: Cafe[]) => {
  const map = new Map<string, number>();

  cafes.forEach((cafe) => {
    if (!cafe.district) return;

    map.set(cafe.district, (map.get(cafe.district) ?? 0) + 1);
  });

  return Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';
};

export default function SummaryCards({ cafes }: Props) {
  const cards = [
    {
      title: 'Total Cafes',
      value: cafes.length,
    },
    {
      title: 'Average Rating',
      value: getAverageRating(cafes),
    },
    {
      title: 'Top District',
      value: getMostCommonDistrict(cafes),
    },
    {
      title: 'Study Friendly',
      value: cafes.filter((cafe) => cafe.study_friendly).length,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="rounded-2xl border shadow-none">
          <CardContent className="p-5">
            <div className="text-sm text-slate-500">{card.title}</div>

            <div className="mt-2 text-2xl font-bold text-slate-900">
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
