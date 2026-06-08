import type { Cafe } from '@/types/cafe';
import client from './client';

export type CreateCafePayload = {
  name: string;
  description: string;
  district: string;
  vibe: string;
  price_level: string;
  image_url?: string | null;
  rating?: number | null;
  wifi?: boolean;
  quiet?: boolean;
  study_friendly?: boolean;
  nature?: boolean;
  lat?: number | null;
  lng?: number | null;
};

export type UpdateCafePayload = Partial<CreateCafePayload>;

export const getCafes = async (): Promise<Cafe[]> => {
  const res = await client.get('/cafes');
  return res.data as Cafe[];
};

export const getCafeById = async (id: number | string): Promise<Cafe> => {
  const res = await client.get(`/cafes/${id}`);
  return res.data as Cafe;
};

export const createCafe = async (payload: CreateCafePayload): Promise<Cafe> => {
  const res = await client.post('/cafes', payload);
  return res.data as Cafe;
};

export const updateCafe = async (
  id: number | string,
  payload: UpdateCafePayload,
): Promise<Cafe> => {
  const res = await client.put(`/cafes/${id}`, payload);
  return res.data as Cafe;
};

export const deleteCafe = async (
  id: number | string,
): Promise<{ message: string }> => {
  const res = await client.delete(`/cafes/${id}`);
  return res.data as { message: string };
};
