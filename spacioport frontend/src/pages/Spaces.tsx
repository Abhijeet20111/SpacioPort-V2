import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Loader2, RotateCcw } from 'lucide-react';
import { cities } from '@/data/mockData';
import { spacesAPI } from '@/lib/api';
import SpaceCard from '@/components/SpaceCard';
import type { Space } from '@/data/mockData';

const FILTERS_KEY = 'sp_filters_v2';

interface FilterState {
  type: '' | 'virtual' | 'physical';
  duration: '' | 'long-term' | 'on-demand';
  city: string;
}

const defaultFilters: FilterState = { type: '', duration: '', city: '' };

const loadPersisted = (): FilterState => {
  try {
    const raw = localStorage.getItem(FILTERS_KEY);
    if (!raw) return defaultFilters;
    const parsed = JSON.parse(raw);
    return { ...defaultFilters, ...parsed };
  } catch {
    return defaultFilters;
  }
};

const Spaces = () => {
  const [searchParams] = useSearchParams();

  // Hydrate from URL once (homepage search, "Find spaces near you" map, etc.),
  // then drop back to persisted filters. URL is read-only — filter changes do NOT navigate.
  const [filters, setFilters] = useState<FilterState>(() => {
    const urlType = searchParams.get('type');
    const urlDuration = searchParams.get('duration');
    const urlCity = searchParams.get('city');
    if (urlType || urlDuration || urlCity) {
      // Map legacy values from older links
      let type: FilterState['type'] = '';
      let duration: FilterState['duration'] = '';
      if (urlType === 'virtual') type = 'virtual';
      else if (urlType === 'physical') type = 'physical';
      else if (urlType === 'longterm') { type = 'physical'; duration = 'long-term'; }
      else if (urlType === 'ondemand') { type = 'physical'; duration = 'on-demand'; }
      if (urlDuration === 'long-term' || urlDuration === 'on-demand') duration = urlDuration;
      return {
        type,
        duration,
        city: type === 'virtual' ? '' : (urlCity || ''),
      };
    }
    return loadPersisted();
  });
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  }, [filters]);

  // Disable city when type=virtual (per spec)
  const cityDisabled = filters.type === 'virtual';
  // Disable duration when type=virtual
  const durationDisabled = filters.type === 'virtual';

  useEffect(() => {
    let cancelled = false;
    const fetchSpaces = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          type: filters.type,
          // Only send city if not virtual
          city: cityDisabled ? '' : filters.city,
          duration: durationDisabled ? '' : filters.duration,
          limit: 100,
        };
        const res = await spacesAPI.list(params);
        if (cancelled) return;
        if (res.data?.success) {
          setSpaces(
            res.data.data.map((s: any) => ({
              id: s._id,
              name: s.name,
              location: s.location || s.address || '',
              address: s.address,
              city: s.city || '',
              type: s.type,
              duration: s.duration,
              price: s.price,
              priceUnit: s.priceUnit || '/month',
              discount: s.discount || 0,
              rating: s.rating || 0,
              reviews: s.reviews || 0,
              capacity: s.capacity || 1,
              image: s.image || s.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
              amenities: s.amenities || [],
              description: s.description || '',
              images: s.images?.length ? s.images : [s.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600'],
            }))
          );
        } else {
          setSpaces([]);
        }
      } catch (e: any) {
        if (cancelled) return;
        setSpaces([]);
        setError(
          e?.response?.data?.message ||
            'Could not reach the workspace API. Make sure the backend is running on http://localhost:8000.'
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    setVisibleCount(9);
    fetchSpaces();
    return () => {
      cancelled = true;
    };
  }, [filters.type, filters.duration, filters.city, cityDisabled, durationDisabled]);

  const visible = useMemo(() => spaces.slice(0, visibleCount), [spaces, visibleCount]);
  const reset = () => setFilters(defaultFilters);

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
        Explore Workspaces
      </motion.h1>
      <p className="mb-8 text-muted-foreground">Find the perfect workspace for your needs across India</p>

      {/* Filters — pure state, no navigation */}
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
        <Filter className="h-5 w-5 text-muted-foreground" />

        {/* Type */}
        <select
          value={filters.type}
          onChange={(e) => {
            const type = e.target.value as FilterState['type'];
            // Clear physical-only fields if switching to virtual
            setFilters((f) => ({
              ...f,
              type,
              ...(type === 'virtual' ? { duration: '', city: '' } : {}),
            }));
          }}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Types</option>
          <option value="virtual">Virtual</option>
          <option value="physical">Physical</option>
        </select>

        {/* Duration */}
        <select
          value={filters.duration}
          disabled={durationDisabled}
          onChange={(e) => setFilters((f) => ({ ...f, duration: e.target.value as FilterState['duration'] }))}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          title={durationDisabled ? 'Duration applies to physical spaces only' : ''}
        >
          <option value="">Any Duration</option>
          <option value="long-term">Long-Term</option>
          <option value="on-demand">On-Demand</option>
        </select>

        {/* City */}
        <select
          value={filters.city}
          disabled={cityDisabled}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          title={cityDisabled ? 'Virtual offices are not city-bound' : ''}
        >
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <button
          onClick={reset}
          className="ml-auto flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive">
          {error}
        </div>
      ) : spaces.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold text-foreground">No results found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try removing some filters or pick a different city.
          </p>
          <button
            onClick={reset}
            className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {visible.length} of {spaces.length} {spaces.length === 1 ? 'space' : 'spaces'}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((s) => (
              <SpaceCard key={s.id} space={s} />
            ))}
          </div>
          {visibleCount < spaces.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((v) => v + 9)}
                className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Spaces;
