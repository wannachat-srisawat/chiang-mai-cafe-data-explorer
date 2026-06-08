import { useMemo, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import type { Cafe } from '@/types/cafe';

type Props = {
  cafes: Cafe[];
};

type DistrictMetrics = {
  district: string;
  cafeCount: number;
  averageRating: number;
  studyFriendlyCount: number;
  natureCount: number;
  wifiCount: number;
};

const calculateMetrics = (cafes: Cafe[], district: string): DistrictMetrics => {
  const filtered = cafes.filter((cafe) => cafe.district === district);

  const ratings = filtered
    .map((cafe) => cafe.rating)
    .filter((rating): rating is number => typeof rating === 'number');

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

  return {
    district,
    cafeCount: filtered.length,
    averageRating,
    studyFriendlyCount: filtered.filter((cafe) => cafe.study_friendly).length,
    natureCount: filtered.filter((cafe) => cafe.nature).length,
    wifiCount: filtered.filter((cafe) => cafe.wifi).length,
  };
};

export default function CompareDistricts({ cafes }: Props) {
  const districts = useMemo(() => {
    return Array.from(
      new Set(cafes.map((cafe) => cafe.district).filter(Boolean)),
    ).sort();
  }, [cafes]);

  const [leftDistrict, setLeftDistrict] = useState(districts[0] ?? '');

  const [rightDistrict, setRightDistrict] = useState(districts[1] ?? '');

  const leftMetrics = useMemo(
    () => calculateMetrics(cafes, leftDistrict),
    [cafes, leftDistrict],
  );

  const rightMetrics = useMemo(
    () => calculateMetrics(cafes, rightDistrict),
    [cafes, rightDistrict],
  );

  const rows = [
    {
      label: 'Cafe Count',
      left: leftMetrics.cafeCount,
      right: rightMetrics.cafeCount,
    },
    {
      label: 'Average Rating',
      left:
        leftMetrics.averageRating > 0
          ? leftMetrics.averageRating.toFixed(1)
          : '-',
      right:
        rightMetrics.averageRating > 0
          ? rightMetrics.averageRating.toFixed(1)
          : '-',
    },
    {
      label: 'Study Friendly',
      left: leftMetrics.studyFriendlyCount,
      right: rightMetrics.studyFriendlyCount,
    },
    {
      label: 'Nature Cafes',
      left: leftMetrics.natureCount,
      right: rightMetrics.natureCount,
    },
    {
      label: 'Wi-Fi Cafes',
      left: leftMetrics.wifiCount,
      right: rightMetrics.wifiCount,
    },
  ];

  return (
    <Card className="rounded-2xl border shadow-none">
      <CardContent className="p-5">
        <div className="mb-4">
          <div className="font-semibold text-slate-900">Compare Districts</div>

          <div className="text-sm text-slate-500">
            Compare cafe density and work-friendly signals between areas.
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={leftDistrict}
            onChange={(e) => setLeftDistrict(e.target.value)}
            className="border-input bg-background h-10 rounded-md border px-3 text-sm"
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>

          <select
            value={rightDistrict}
            onChange={(e) => setRightDistrict(e.target.value)}
            className="border-input bg-background h-10 rounded-md border px-3 text-sm"
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-3 font-medium">Metric</th>

                <th className="py-3 font-medium text-slate-900">
                  {leftDistrict}
                </th>

                <th className="py-3 font-medium text-slate-900">
                  {rightDistrict}
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b last:border-0">
                  <td className="py-3 text-slate-500">{row.label}</td>

                  <td className="py-3 font-medium text-slate-900">
                    {row.left}
                  </td>

                  <td className="py-3 font-medium text-slate-900">
                    {row.right}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
