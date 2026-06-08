import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type CafeSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CafeSearchBar({ value, onChange }: CafeSearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search cafes by name or district..."
        className="h-12 rounded-full border-stone-200 bg-white pl-11 shadow-sm"
      />
    </div>
  );
}
