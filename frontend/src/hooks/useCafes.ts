import client from '@/api/client';
import type { Cafe } from '@/types/cafe';
import useSWR from 'swr';

type CafesQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  district?: string;
  vibe?: string;
  price_level?: number;
  wifi?: boolean;
  quiet?: boolean;
  study_friendly?: boolean;
  nature?: boolean;
};

type CafesMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

type CafesResponse = {
  data: Cafe[];
  meta: CafesMeta;
};

const defaultMeta: CafesMeta = {
  page: 1,
  limit: 9,
  total: 0,
  total_pages: 0,
};

const fetcher = async ([url, params]: [
  string,
  CafesQueryParams,
]): Promise<CafesResponse> => {
  const res = await client.get<CafesResponse>(url, { params });
  return res.data;
};

export default function useCafes(params: CafesQueryParams = {}) {
  const { data, error, isLoading } = useSWR<CafesResponse>(
    ['/cafes', params],
    fetcher,
  );

  return {
    cafes: data?.data ?? [],
    meta: data?.meta ?? defaultMeta,
    isLoading,
    error,
  };
}
