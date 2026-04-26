import { useParams, useNavigate, Link } from 'react-router-dom';
import { spacesAPI, wishlistAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, Heart, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Space } from '@/data/mockData';

const typeLabel = (s: Pick<Space, 'type' | 'duration'>) => {
  if (s.type === 'virtual') return 'Virtual Office';
  if (s.type === 'physical') return s.duration === 'long-term' ? 'Long-Term Lease' : 'On-Demand';
  if (s.type === 'longterm') return 'Long-Term Lease';
  if (s.type === 'ondemand') return 'On-Demand';
  return 'Workspace';
};

const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchSpace = async () => {
      setLoading(true);
      try {
        const res = await spacesAPI.get(id!);
        if (res.data.success) {
          const s = res.data.data;
          setSpace({
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
            image: s.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
            amenities: s.amenities || [],
            description: s.description || '',
            images: s.images?.length ? s.images : [s.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600'],
          });
        }
      } catch {
        setSpace(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSpace();
  }, [id]);

  const handleWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await wishlistAPI.add(space!.id);
      toast.success('Added to wishlist!');
    } catch {
      toast.error('Could not add to wishlist.');
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (!space) return <div className="container mx-auto px-4 py-20 text-center">Space not found. <button onClick={() => navigate('/spaces')} className="text-accent underline">Browse all spaces</button></div>;

  const discountedPrice = space.discount ? space.price * (1 - space.discount / 100) : space.price;
  const isVirtual = space.type === 'virtual';

  return (
    <div className="container mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 overflow-hidden rounded-2xl">
            <img src={space.images[selectedImage]} alt={space.name} className="h-72 w-full object-cover md:h-96" />
          </motion.div>
          {space.images.length > 1 && (
            <div className="mb-8 flex gap-2 overflow-x-auto">
              {space.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${i === selectedImage ? 'border-accent' : 'border-transparent'}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <h1 className="mb-2 text-3xl font-bold text-foreground">{space.name}</h1>
          {!isVirtual && (
            <p className="mb-4 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {space.location}{space.city ? `, ${space.city}` : ''}
            </p>
          )}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-accent text-accent" /> {Number(space.rating).toFixed(1)} ({space.reviews} reviews)</span>
            <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" /> Up to {space.capacity} people</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {typeLabel(space)}
            </span>
          </div>

          {space.description && (
            <p className="mb-8 leading-relaxed text-muted-foreground">{space.description}</p>
          )}

          {space.amenities.length > 0 && (
            <>
              <h3 className="mb-4 text-xl font-bold">Amenities</h3>
              <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
                {space.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
                    <Check className="h-4 w-4 text-success" /> {a}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sticky booking widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4">
              <span className="text-3xl font-extrabold text-foreground">₹{discountedPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              <span className="text-muted-foreground">{space.priceUnit}</span>
              {space.discount > 0 && (
                <span className="ml-2 inline-block rounded-full bg-success/10 px-2.5 py-0.5 text-sm font-semibold text-success">
                  Save {space.discount}%
                </span>
              )}
            </div>
            {space.discount > 0 && <p className="mb-4 text-sm text-muted-foreground line-through">₹{space.price.toLocaleString('en-IN')}{space.priceUnit}</p>}

            <p className="mb-5 text-sm text-muted-foreground">
              Submit a booking request and our team will contact you to confirm availability and finalise pricing.
            </p>

            <Link
              to={`/book/${space.id}`}
              className="gradient-cta mb-3 block w-full rounded-xl py-3 text-center font-bold text-accent-foreground transition hover:opacity-90"
            >
              Book Now
            </Link>
            <button onClick={() => navigate('/contact')}
              className="mb-3 w-full rounded-xl border border-border bg-background py-3 text-center font-semibold text-foreground transition hover:bg-secondary">
              Request a Tour
            </button>
            <button onClick={handleWishlist}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-muted-foreground transition hover:text-accent">
              <Heart className="h-4 w-4" /> Save to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetail;
