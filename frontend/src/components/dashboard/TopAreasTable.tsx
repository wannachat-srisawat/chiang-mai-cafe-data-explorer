import { Card, CardContent } from '@/components/ui/card';
import type { Cafe } from '@/types/cafe';

type Props = {
  cafes: Cafe[];
};

type AreaRow = {
  district: string;
  cafeCount: number;
  averageRating: number;
  studyFriendlyCount: number;
  natureCount: number;
  wifiCount: number;
};

const getAreaRows = (cafes: Cafe[]): AreaRow[] => {
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

  return Array.from(map.values())
    .map((item) => ({
      district: item.district,
      cafeCount: item.cafeCount,
      averageRating:
        item.ratingCount > 0 ? item.totalRating / item.ratingCount : 0,
      studyFriendlyCount: item.studyFriendlyCount,
      natureCount: item.natureCount,
      wifiCount: item.wifiCount,
    }))
    .sort((a, b) => b.cafeCount - a.cafeCount);
};

export default function TopAreasTable({ cafes }: Props) {
  const rows = getAreaRows(cafes);

  return (
    <Card className="rounded-2xl border shadow-none">
      <CardContent className="p-5">
        <div className="mb-4">
          <div className="font-semibold text-slate-900">Top Areas Overview</div>
          <div className="text-sm text-slate-500">
            District-level cafe density and work-friendly signals.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-3 font-medium">District</th>
                <th className="py-3 font-medium">Cafes</th>
                <th className="py-3 font-medium">Avg Rating</th>
                <th className="py-3 font-medium">Study</th>
                <th className="py-3 font-medium">Nature</th>
                <th className="py-3 font-medium">Wi-Fi</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.district} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-900">
                    {row.district}
                  </td>
                  <td className="py-3 text-slate-600">{row.cafeCount}</td>
                  <td className="py-3 text-slate-600">
                    {row.averageRating > 0 ? row.averageRating.toFixed(1) : '-'}
                  </td>
                  <td className="py-3 text-slate-600">
                    {row.studyFriendlyCount}
                  </td>
                  <td className="py-3 text-slate-600">{row.natureCount}</td>
                  <td className="py-3 text-slate-600">{row.wifiCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
