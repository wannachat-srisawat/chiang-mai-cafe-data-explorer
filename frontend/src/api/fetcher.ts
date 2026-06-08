import client from './client';

export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const res = await client.get<T>(url);
  return res.data;
};
