import { Card, CardContent } from '@/components/ui/card';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function ChartCard({ title, children }: Props) {
  return (
    <Card className="rounded-2xl border shadow-none">
      <CardContent className="p-5">
        <div className="mb-4 font-semibold text-slate-900">{title}</div>

        {children}
      </CardContent>
    </Card>
  );
}
