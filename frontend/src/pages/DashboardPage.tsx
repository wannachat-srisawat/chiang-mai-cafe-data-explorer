import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import CafesByDistrictChart from '@/components/dashboard/CafesByDistrictChart';
import CompareDistricts from '@/components/dashboard/CompareDistricts';
import FeatureDistributionChart from '@/components/dashboard/FeatureDistributionChart';
import InsightCards from '@/components/dashboard/InsightCards';
import OpportunityScoreCard from '@/components/dashboard/OpportunityScoreCard';
import PriceDistributionChart from '@/components/dashboard/PriceDistributionChart';
import SummaryCards from '@/components/dashboard/SummaryCards';
import TopAreasTable from '@/components/dashboard/TopAreasTable';
import TopVibesChart from '@/components/dashboard/TopVibesChart';
import { Button } from '@/components/ui/button';
import useCafes from '@/hooks/useCafes';
import type { Cafe } from '@/types/cafe';

const countBy = (
  cafes: Cafe[],
  getKey: (cafe: Cafe) => string | null | undefined,
) => {
  const map = new Map<string, number>();

  cafes.forEach((cafe) => {
    const key = getKey(cafe);
    if (!key) return;

    map.set(key, (map.get(key) ?? 0) + 1);
  });

  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

const getPriceLevelKey = (priceLevel: string | number | null | undefined) => {
  if (!priceLevel) return null;

  if (priceLevel === '$') return '1';
  if (priceLevel === '$$') return '2';
  if (priceLevel === '$$$') return '3';
  if (priceLevel === '$$$$') return '4';

  return String(priceLevel);
};

const priceLabels: Record<string, string> = {
  '1': '$',
  '2': '$$',
  '3': '$$$',
  '4': '$$$$',
};

export default function DashboardPage() {
  const navigate = useNavigate();

  const { cafes, isLoading, error } = useCafes({
    page: 1,
    limit: 1000,
  });

  const districtData = useMemo(() => {
    return countBy(cafes, (cafe) => cafe.district);
  }, [cafes]);

  const priceData = useMemo(() => {
    return ['1', '2', '3', '4']
      .map((level) => ({
        name: priceLabels[level],
        count: cafes.filter(
          (cafe) => getPriceLevelKey(cafe.price_level) === level,
        ).length,
      }))
      .filter((item) => item.count > 0);
  }, [cafes]);

  const vibeData = useMemo(() => {
    return countBy(cafes, (cafe) => cafe.vibe).slice(0, 8);
  }, [cafes]);

  const featureData = useMemo(
    () => [
      {
        name: 'Wi-Fi',
        count: cafes.filter((cafe) => cafe.wifi).length,
      },
      {
        name: 'Quiet',
        count: cafes.filter((cafe) => cafe.quiet).length,
      },
      {
        name: 'Study',
        count: cafes.filter((cafe) => cafe.study_friendly).length,
      },
      {
        name: 'Nature',
        count: cafes.filter((cafe) => cafe.nature).length,
      },
    ],
    [cafes],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-red-500">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Cafe Analytics Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Explore cafe density, pricing, rating, vibe, and work-friendly
              patterns.
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate('/cafes')}>
            Back to List
          </Button>
        </div>

        <SummaryCards cafes={cafes} />
        <InsightCards cafes={cafes} />
        <OpportunityScoreCard cafes={cafes} />

        <div className="grid gap-4 lg:grid-cols-2">
          <CafesByDistrictChart data={districtData} />
          <PriceDistributionChart data={priceData} />
          <FeatureDistributionChart data={featureData} />
          <TopVibesChart data={vibeData} />
        </div>
        <TopAreasTable cafes={cafes} />
        <CompareDistricts cafes={cafes} />
      </div>
    </div>
  );
}
