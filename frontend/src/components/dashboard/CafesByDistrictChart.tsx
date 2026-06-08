import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartCard from './ChartCard';

type Props = {
  data: {
    name: string;
    count: number;
  }[];
};

export default function CafesByDistrictChart({ data }: Props) {
  return (
    <ChartCard title="Cafes by District">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="2 2" />

          <XAxis dataKey="name" fontSize={12} />

          <YAxis allowDecimals={false} />

          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          />

          <Bar dataKey="count" fill="#334155" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
