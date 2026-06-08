import { fetcher } from '@/api/fetcher';
import type { Cafe } from '@/types/cafe';
import type { KeyedMutator } from 'swr';
import useSWR from 'swr';

type CafeDetailResponse = {
  data: Cafe;
  message?: string;
};

type UseCafeResult = {
  cafe: Cafe | null;
  message: string;
  error: unknown;
  isLoading: boolean;
  mutate: KeyedMutator<CafeDetailResponse>;
};

export default function useCafe(id?: number | string | null): UseCafeResult {
  const { data, error, isLoading, mutate } = useSWR<CafeDetailResponse>(
    id ? `/cafes/${id}` : null,
    fetcher,
  );

  return {
    cafe: data?.data ?? null,
    message: data?.message ?? '',
    error,
    isLoading,
    mutate,
  };
}
