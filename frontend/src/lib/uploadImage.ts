import { supabase } from '@/lib/supabase';

export async function uploadCafeImage(file: File | null): Promise<string> {
  if (!file) return '';

  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
  const filePath = `cafes/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('cafe-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('cafe-images').getPublicUrl(filePath);

  return data.publicUrl;
}
