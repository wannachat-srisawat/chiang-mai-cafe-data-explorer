import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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

const featureColors: Record<string, string> = {
  'Wi-Fi': '#3b82f6',
  Quiet: '#14b8a6',
  Study: '#a855f7',
  Nature: '#84cc16',
};

export default function FeatureDistributionChart({ data }: Props) {
  return (
    <ChartCard title="Feature Distribution">
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
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((item) => (
              <Cell
                key={item.name}
                fill={featureColors[item.name] ?? '#334155'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
