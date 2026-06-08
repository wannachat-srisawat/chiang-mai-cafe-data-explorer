import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useCafes from '@/hooks/useCafes';
import type { Cafe } from '@/types/cafe';
import 'leaflet.heat';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import { useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

const DEFAULT_CENTER: [number, number] = [18.7883, 98.9853]; // Chiang Mai
const DEFAULT_ZOOM = 12;

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const defaultCafeIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedCafeIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [34, 55],
  iconAnchor: [17, 55],
  popupAnchor: [1, -44],
  shadowSize: [55, 55],
});

type MapFilters = {
  search: string;
  district: string;
  vibe: string;
  price_level: string;
  wifi: boolean;
  quiet: boolean;
  study_friendly: boolean;
  nature: boolean;
};

const initialFilters: MapFilters = {
  search: '',
  district: '',
  vibe: '',
  price_level: '',
  wifi: false,
  quiet: false,
  study_friendly: false,
  nature: false,
};

const getCafeLatLng = (cafe: Cafe): [number, number] | null => {
  const lat = Number(cafe.lat);
  const lng = Number(cafe.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return [lat, lng];
};

const MapAutoFit = ({ cafes }: { cafes: Cafe[] }) => {
  const map = useMap();

  useEffect(() => {
    const points = cafes
      .map(getCafeLatLng)
      .filter((point): point is [number, number] => Boolean(point));

    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 15);
      return;
    }

    map.fitBounds(points, {
      padding: [48, 48],
      maxZoom: 15,
    });
  }, [cafes, map]);

  return null;
};

const HeatmapLayer = ({ cafes }: { cafes: Cafe[] }) => {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    const heatPoints = cafes
      .map((cafe) => {
        const position = getCafeLatLng(cafe);

        if (!position) return null;

        return [position[0], position[1], 1];
      })
      .filter(Boolean) as [number, number, number][];

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    // @ts-ignore
    const heatLayer = L.heatLayer(heatPoints, {
      radius: 28,
      blur: 22,
      maxZoom: 17,
      minOpacity: 0.35,
      gradient: {
        0.2: '#93c5fd',
        0.4: '#60a5fa',
        0.6: '#3b82f6',
        0.8: '#2563eb',
        1.0: '#1d4ed8',
      },
    });

    heatLayer.addTo(map);

    layerRef.current = heatLayer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [cafes, map]);

  return null;
};

export default function CafeMapPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<MapFilters>(initialFilters);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const queryParams = useMemo(
    () => ({
      page: 1,
      limit: 100,
      search: filters.search || undefined,
      district: filters.district || undefined,
      vibe: filters.vibe || undefined,
      price_level: filters.price_level
        ? Number(filters.price_level)
        : undefined,
      wifi: filters.wifi || undefined,
      quiet: filters.quiet || undefined,
      study_friendly: filters.study_friendly || undefined,
      nature: filters.nature || undefined,
    }),
    [filters],
  );

  const { cafes, isLoading, error } = useCafes(queryParams);

  const visibleCafes = useMemo(() => {
    return cafes
      .filter((cafe) => getCafeLatLng(cafe))
      .filter((cafe) => {
        if (filters.wifi && !cafe.wifi) return false;
        if (filters.quiet && !cafe.quiet) return false;
        if (filters.study_friendly && !cafe.study_friendly) return false;
        if (filters.nature && !cafe.nature) return false;

        return true;
      });
  }, [cafes, filters]);

  const updateFilter = <K extends keyof MapFilters>(
    key: K,
    value: MapFilters[K],
  ) => {
    setSelectedCafe(null);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSelectedCafe(null);
  };

  const featureFilters = [
    ['wifi', 'Wi-Fi'],
    ['quiet', 'Quiet'],
    ['study_friendly', 'Study friendly'],
    ['nature', 'Nature'],
  ] as const;

  const MapClickHandler = ({ onClick }: { onClick: () => void }) => {
    useMapEvents({
      click: onClick,
    });

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Chiang Mai Cafe Map
            </h1>
            <p className="text-sm text-slate-500">
              Explore cafes around Chiang Mai by district, vibe, price, and
              work-friendly features.
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate('/cafes')}>
            Back to List
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Card className="h-fit rounded-2xl shadow-sm">
            <CardContent className="grid gap-4 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>

              <div className="relative">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                <Input
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  placeholder="Search cafe..."
                  className="pl-9"
                />
              </div>

              <Input
                value={filters.district}
                onChange={(e) => updateFilter('district', e.target.value)}
                placeholder="District e.g. Nimman"
              />

              <Input
                value={filters.vibe}
                onChange={(e) => updateFilter('vibe', e.target.value)}
                placeholder="Vibe e.g. cozy, minimal"
              />

              <select
                value={filters.price_level}
                onChange={(e) => updateFilter('price_level', e.target.value)}
                className="border-input bg-background h-10 rounded-md border px-3 text-sm"
              >
                <option value="">All price levels</option>
                <option value="1">$</option>
                <option value="2">$$</option>
                <option value="3">$$$</option>
                <option value="4">$$$$</option>
              </select>

              <div className="grid gap-3 rounded-xl border bg-white p-3">
                {featureFilters.map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={key}
                      checked={filters[key]}
                      onCheckedChange={(checked) => {
                        updateFilter(key, checked === true);
                      }}
                    />
                    <Label htmlFor={key} className="cursor-pointer text-sm">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>

              <Button variant="secondary" onClick={resetFilters}>
                Reset filters
              </Button>

              <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600">
                Showing{' '}
                <span className="font-semibold text-slate-900">
                  {visibleCafes.length}
                </span>{' '}
                cafes on map
              </div>
            </CardContent>
            <div className="flex items-center gap-2 rounded-xl border bg-white p-3">
              <Checkbox
                id="heatmap"
                checked={showHeatmap}
                onCheckedChange={(checked) => setShowHeatmap(checked === true)}
              />

              <Label htmlFor="heatmap" className="cursor-pointer text-sm">
                Show Heatmap
              </Label>
            </div>
          </Card>

          <Card className="overflow-hidden rounded-2xl shadow-sm">
            <CardContent className="p-0">
              {error ? (
                <div className="flex h-[680px] items-center justify-center text-sm text-red-500">
                  Failed to load cafes.
                </div>
              ) : (
                <div className="relative h-[680px]">
                  {isLoading && (
                    <div className="absolute inset-0 z-1000 flex items-center justify-center bg-white/70 text-sm font-medium text-slate-600">
                      Loading cafes...
                    </div>
                  )}
                  {selectedCafe && (
                    <div className="absolute right-4 bottom-4 left-4 z-1000 md:left-auto md:w-[380px]">
                      <div className="rounded-2xl border bg-white p-4 shadow-lg">
                        <div className="flex gap-3">
                          {selectedCafe.image_url && (
                            <img
                              src={selectedCafe.image_url}
                              alt={selectedCafe.name}
                              className="h-20 w-20 rounded-xl object-cover"
                            />
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="truncate font-semibold text-slate-900">
                              {selectedCafe.name}
                            </div>

                            <div className="mt-1 text-xs text-slate-500">
                              {selectedCafe.district || 'Unknown district'}
                            </div>

                            <div className="mt-2 line-clamp-2 text-sm text-slate-600">
                              {selectedCafe.description || 'No description'}
                            </div>

                            <div className="mt-3 flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  navigate(`/cafes/${selectedCafe.id}`)
                                }
                              >
                                View detail
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedCafe(null)}
                              >
                                Close
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <MapContainer
                    center={DEFAULT_CENTER}
                    zoom={DEFAULT_ZOOM}
                    scrollWheelZoom
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapAutoFit cafes={visibleCafes} />
                    {showHeatmap && <HeatmapLayer cafes={visibleCafes} />}
                    <MapClickHandler onClick={() => setSelectedCafe(null)} />

                    <MarkerClusterGroup chunkedLoading>
                      {visibleCafes.map((cafe) => {
                        const position = getCafeLatLng(cafe);
                        if (!position) return null;

                        return (
                          <Marker
                            key={cafe.id}
                            position={position}
                            icon={
                              selectedCafe?.id === cafe.id
                                ? selectedCafeIcon
                                : defaultCafeIcon
                            }
                            zIndexOffset={
                              selectedCafe?.id === cafe.id ? 1000 : 0
                            }
                            eventHandlers={{
                              click: (e) => {
                                e.originalEvent.stopPropagation();
                                setSelectedCafe(cafe);
                              },
                            }}
                          />
                        );
                      })}
                    </MarkerClusterGroup>
                  </MapContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
