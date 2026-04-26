import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Space } from '@/data/mockData';

const typeLabel = (s: Pick<Space, 'type' | 'duration'>) => {
  if (s.type === 'virtual') return 'Virtual';
  if (s.type === 'physical') return s.duration === 'long-term' ? 'Long-Term' : s.duration === 'on-demand' ? 'On-Demand' : 'Physical';
  // Legacy fallbacks
  if (s.type === 'longterm') return 'Long-Term';
  if (s.type === 'ondemand') return 'On-Demand';
  return 'Workspace';
};

const SpaceCard = ({ space }: { space: Space }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
        src={space.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600'}
        alt={space.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        {space.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-success px-3 py-1 text-xs font-bold text-success-foreground">
            {space.discount}% OFF
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium text-card-foreground backdrop-blur-sm">
          {typeLabel(space)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-lg font-semibold text-card-foreground">{space.name}</h3>
        <p className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {space.location || space.city || '—'}
        </p>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-medium">{(Number(space.rating || 0)).toFixed(1)}</span>
            <span className="text-muted-foreground">({space.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> {space.capacity}
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {(space.amenities || []).slice(0, 3).map((a) => (
            <span key={a} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{a}</span>
          ))}
          {space.amenities.length > 3 && (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">+{space.amenities.length - 3}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-foreground">
            ₹{space.price.toLocaleString('en-IN')}<span className="text-sm font-normal text-muted-foreground">{space.priceUnit}</span>
          </p>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/space/${space.id}`)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90">
              View Details
            </button>
            <button onClick={() => navigate(`/book/${space.id}`)} className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground transition hover:opacity-90">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpaceCard;
