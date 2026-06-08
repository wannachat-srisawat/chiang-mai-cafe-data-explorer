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

const vibeColors = ['#334155', '#3b82f6', '#14b8a6', '#a855f7', '#f59e0b'];

export default function TopVibesChart({ data }: Props) {
  return (
    <ChartCard title="Top Vibes">
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
            {data.map((item, index) => (
              <Cell
                key={item.name}
                fill={vibeColors[index % vibeColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
