import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import ChartCard from './ChartCard';

type Props = {
  data: {
    name: string;
    count: number;
  }[];
};

const colors = ['#334155', '#3b82f6', '#14b8a6', '#f59e0b'];

export default function PriceDistributionChart({ data }: Props) {
  return (
    <ChartCard title="Price Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((item, index) => (
              <Cell key={item.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
