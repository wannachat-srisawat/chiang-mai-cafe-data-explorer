import type { CreateCafePayload } from '@/api/cafes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { uploadCafeImage } from '@/lib/uploadImage';
import { ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';

type FeatureKey = 'wifi' | 'quiet' | 'study_friendly' | 'nature';

type CafeFormValues = {
  name: string;
  description: string;
  district: string;
  image_url: string;
  latitude: string;
  longitude: string;
  rating: string;
  price_level: string;
  vibe: string;
  wifi: boolean;
  quiet: boolean;
  study_friendly: boolean;
  nature: boolean;
};

type CafeFormErrors = Partial<Record<keyof CafeFormValues, string>>;

type CafeFormSubmitPayload = CreateCafePayload;

type CafeFormInitialValues = Omit<
  Partial<CafeFormValues>,
  'latitude' | 'longitude' | 'rating' | 'price_level' | 'image_url'
> & {
  latitude?: number | string | null;
  longitude?: number | string | null;
  rating?: number | string | null;
  price_level?: number | string | null;
  image_url?: string | null;
};

type CafeFormProps = {
  initialValues?: CafeFormInitialValues;
  onSubmit: (payload: CafeFormSubmitPayload) => Promise<void> | void;
  submitting?: boolean;
  submitText?: string;
};

const EMPTY_FORM: CafeFormValues = {
  name: '',
  description: '',
  district: '',
  image_url: '',
  latitude: '',
  longitude: '',
  rating: '',
  price_level: '1',
  vibe: '',
  wifi: false,
  quiet: false,
  study_friendly: false,
  nature: false,
};

const vibeOptions: { label: string; value: string }[] = [
  { label: 'Minimal', value: 'minimal' },
  { label: 'Nature', value: 'nature' },
  { label: 'Cozy', value: 'cozy' },
  { label: 'Modern', value: 'modern' },
  { label: 'Work-friendly', value: 'work-friendly' },
];

const featureOptions: { label: string; key: FeatureKey; emoji: string }[] = [
  { label: 'Wi-Fi', key: 'wifi', emoji: '📶' },
  { label: 'Quiet', key: 'quiet', emoji: '🤫' },
  { label: 'Study Friendly', key: 'study_friendly', emoji: '📚' },
  { label: 'Nature', key: 'nature', emoji: '🌿' },
];

export default function CafeForm({
  initialValues,
  onSubmit,
  submitting = false,
  submitText = 'Save',
}: CafeFormProps) {
  const [form, setForm] = useState<CafeFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<CafeFormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const nextForm: CafeFormValues = {
      ...EMPTY_FORM,
      ...(initialValues ?? {}),
      latitude:
        initialValues?.latitude !== null &&
        initialValues?.latitude !== undefined
          ? String(initialValues.latitude)
          : '',
      longitude:
        initialValues?.longitude !== null &&
        initialValues?.longitude !== undefined
          ? String(initialValues.longitude)
          : '',
      rating:
        initialValues?.rating !== null && initialValues?.rating !== undefined
          ? String(initialValues.rating)
          : '',
      price_level:
        initialValues?.price_level !== null &&
        initialValues?.price_level !== undefined
          ? String(initialValues.price_level)
          : '1',
      vibe: initialValues?.vibe || '',
      wifi: initialValues?.wifi ?? false,
      quiet: initialValues?.quiet ?? false,
      study_friendly: initialValues?.study_friendly ?? false,
      nature: initialValues?.nature ?? false,
      image_url: initialValues?.image_url ?? '',
    };

    setForm(nextForm);
    setPreviewImage(initialValues?.image_url || '');
    setImageFile(null);
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleCheckboxChange = (name: FeatureKey, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      alert('Image must be smaller than 6MB');
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const validate = (): boolean => {
    const nextErrors: CafeFormErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.district.trim()) nextErrors.district = 'District is required';

    const rating = Number(form.rating || 0);
    if (rating < 0 || rating > 5) {
      nextErrors.rating = 'Rating must be between 0 and 5';
    }

    const priceLevel = Number(form.price_level || 1);
    if (priceLevel < 1 || priceLevel > 4) {
      nextErrors.price_level = 'Price level must be between 1 and 4';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    let imageUrl = form.image_url;

    try {
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadCafeImage(imageFile);
      }

      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        district: form.district.trim(),
        image_url: imageUrl?.trim() || '',
        lat: form.latitude !== '' ? Number(form.latitude) : null,
        lng: form.longitude !== '' ? Number(form.longitude) : null,
        rating: Number(form.rating) || 0,
        price_level: form.price_level,
        vibe: form.vibe.trim(),
        wifi: Boolean(form.wifi),
        quiet: Boolean(form.quiet),
        study_friendly: Boolean(form.study_friendly),
        nature: Boolean(form.nature),
      });
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-3xl rounded-2xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{submitText}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-stone-900">Basic Info</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Cafe Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Forest Brew"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="e.g. Nimman"
              />
              {errors.district && (
                <p className="text-sm text-red-500">{errors.district}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell us what makes this cafe special..."
                rows={5}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-stone-900">Image</h2>

            <div className="space-y-2">
              <Label>Upload Image</Label>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label htmlFor="image">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer rounded-full"
                    asChild
                  >
                    <span>
                      <ImagePlus className="mr-2 h-4 w-4" />
                      Choose file
                    </span>
                  </Button>
                </label>

                <span className="text-sm text-stone-500">
                  {imageFile ? imageFile.name : 'No file selected'}
                </span>
              </div>
            </div>

            {previewImage && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="overflow-hidden rounded-xl border">
                  <img
                    src={previewImage}
                    alt="preview"
                    className="h-64 w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-stone-900">
              Location & Insight
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="18.7883"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="98.9853"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                />
                {errors.rating && (
                  <p className="text-sm text-red-500">{errors.rating}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_level">Price Level</Label>
                <select
                  id="price_level"
                  name="price_level"
                  value={form.price_level}
                  onChange={handleChange}
                  className="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="1">1 - Budget</option>
                  <option value="2">2 - Moderate</option>
                  <option value="3">3 - Premium</option>
                  <option value="4">4 - Luxury</option>
                </select>
                {errors.price_level && (
                  <p className="text-sm text-red-500">{errors.price_level}</p>
                )}
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label>Vibe</Label>

                <div className="flex flex-wrap gap-3">
                  {vibeOptions.map((option) => {
                    const selected = form.vibe === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            vibe: option.value,
                          }))
                        }
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          selected
                            ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                            : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-stone-900">Features</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {featureOptions.map((feature) => {
                const selected = form[feature.key];

                return (
                  <button
                    key={feature.key}
                    type="button"
                    onClick={() => handleCheckboxChange(feature.key, !selected)}
                    className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                      selected
                        ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                        : 'border-stone-200 bg-white text-stone-900 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                        selected ? 'bg-white/15' : 'bg-stone-100'
                      }`}
                    >
                      {feature.emoji}
                    </div>

                    <div>
                      <p className="text-lg font-semibold">{feature.label}</p>
                      <p
                        className={`text-sm ${
                          selected ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {selected ? 'Selected' : 'Tap to enable'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl"
            disabled={submitting || uploading}
          >
            {uploading
              ? 'Uploading image...'
              : submitting
                ? 'Saving...'
                : submitText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
