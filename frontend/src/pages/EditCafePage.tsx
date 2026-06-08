import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { mutate } from 'swr';

import { updateCafe, type CreateCafePayload } from '../api/cafes';
import CafeForm from '../components/CafeForm';
import useCafe from '../hooks/useCafe';

export default function EditCafePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { cafe, isLoading, error } = useCafe(id);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const initialValues = useMemo(
    () => ({
      name: cafe?.name || '',
      description: cafe?.description || '',
      district: cafe?.district || '',
      image_url: cafe?.image_url || '',
      latitude: cafe?.lat ?? '',
      longitude: cafe?.lng ?? '',
      rating: cafe?.rating ?? '',
      price_level: cafe?.price_level ?? '',
      wifi: cafe?.wifi ?? false,
      quiet: cafe?.quiet ?? false,
      study_friendly: cafe?.study_friendly ?? false,
      nature: cafe?.nature ?? false,
      vibe: cafe?.vibe || '',
    }),
    [
      cafe?.name,
      cafe?.description,
      cafe?.district,
      cafe?.image_url,
      cafe?.lat,
      cafe?.lng,
      cafe?.rating,
      cafe?.price_level,
      cafe?.wifi,
      cafe?.quiet,
      cafe?.study_friendly,
      cafe?.nature,
      cafe?.vibe,
    ],
  );

  const handleUpdate = async (payload: CreateCafePayload) => {
    if (!id) return;

    try {
      setSubmitting(true);
      await updateCafe(id, payload);

      await mutate(`/cafes/${id}`);

      await mutate(
        (key) => Array.isArray(key) && key[0] === '/cafes',
        undefined,
        { revalidate: true },
      );

      navigate(`/cafes/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to update cafe');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-muted-foreground text-sm">Loading cafe...</p>
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm text-red-500">Failed to load cafe</p>
        <Link
          to="/cafes"
          className="text-muted-foreground hover:text-foreground mt-4 inline-block text-sm font-medium"
        >
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Cafe</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Update cafe information.
          </p>
        </div>

        <Link
          to={`/cafes/${id}`}
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          ← Back
        </Link>
      </div>

      <CafeForm
        initialValues={initialValues}
        onSubmit={handleUpdate}
        submitting={submitting}
        submitText="Update Cafe"
      />
    </div>
  );
}
