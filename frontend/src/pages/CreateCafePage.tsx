import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import { createCafe, type CreateCafePayload } from '../api/cafes';
import CafeForm from '../components/CafeForm';

export default function CreateCafePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleCreate = async (payload: CreateCafePayload) => {
    try {
      setSubmitting(true);
      await createCafe(payload);

      await mutate(
        (key) => Array.isArray(key) && key[0] === '/cafes',
        undefined,
        { revalidate: true },
      );

      navigate('/cafes');
    } catch (err) {
      console.error(err);
      alert('Failed to create cafe');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Cafe</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add a new cafe into your explorer list.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          ← Back
        </button>
      </div>

      <CafeForm
        onSubmit={handleCreate}
        submitting={submitting}
        submitText="Create Cafe"
      />
    </div>
  );
}
