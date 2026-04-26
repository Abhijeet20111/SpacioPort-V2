import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, MapPin, Star, Users, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { spacesAPI, bookingsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email').max(255),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a valid phone number')
    .max(20)
    .regex(/^[+\d\s\-()]+$/, 'Phone can only contain digits, spaces and + - ( )'),
  message: z.string().trim().max(1000).optional(),
});

interface SpaceLite {
  _id: string;
  name: string;
  type: string;
  duration?: string;
  city?: string;
  address?: string;
  location?: string;
  price: number;
  priceUnit: string;
  rating?: number;
  reviews?: number;
  capacity?: number;
  image?: string;
  images?: string[];
}

const Book = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [space, setSpace] = useState<SpaceLite | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const fetchSpace = async () => {
      setLoading(true);
      try {
        const res = await spacesAPI.get(spaceId!);
        if (res.data.success) setSpace(res.data.data);
      } catch {
        setSpace(null);
      } finally {
        setLoading(false);
      }
    };
    if (spaceId) fetchSpace();
  }, [spaceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = bookingSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      await bookingsAPI.create({
        spaceId: spaceId!,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message || '',
      });
      setSuccess(true);
      toast.success('Booking request submitted!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="mb-4 text-foreground">Space not found.</p>
        <Link to="/spaces" className="text-accent underline">Browse all spaces</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-20 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6 flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-success" />
        </motion.div>
        <h1 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">Booking Request Sent!</h1>
        <p className="mb-8 text-muted-foreground">
          Thanks {form.name.split(' ')[0]}. Our team will contact you on{' '}
          <span className="font-semibold text-foreground">{form.phone}</span> within 24 hours to confirm your booking for{' '}
          <span className="font-semibold text-foreground">{space.name}</span>.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/spaces" className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
            Browse more spaces
          </Link>
          <Link to="/dashboard" className="rounded-xl border border-border px-5 py-3 font-semibold text-foreground transition hover:bg-secondary">
            View my bookings
          </Link>
        </div>
      </div>
    );
  }

  const isVirtual = space.type === 'virtual';
  const locationLine = isVirtual
    ? 'Virtual Office'
    : `${space.address || space.location || ''}${space.city ? `, ${space.city}` : ''}`;

  return (
    <div className="container mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Booking form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="lg:col-span-2 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8"
        >
          <div>
            <h1 className="mb-1 text-2xl font-bold text-foreground md:text-3xl">Book this workspace</h1>
            <p className="text-sm text-muted-foreground">Fill in your details — our team will reach out to confirm.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Rahul Sharma"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="rahul@example.com"
                maxLength={255}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                maxLength={20}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your team size, preferred move-in date, etc."
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">{form.message.length}/1000</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="gradient-cta w-full rounded-xl py-3 font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit Booking Request'}
          </button>
        </motion.form>

        {/* Space summary */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <img
              src={space.image || space.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600'}
              alt={space.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-5">
              <h2 className="mb-1 text-lg font-bold text-foreground">{space.name}</h2>
              <p className="mb-3 flex items-start gap-1 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> {locationLine}
              </p>
              <div className="mb-4 flex items-center gap-4 text-sm">
                {!!space.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" /> {space.rating.toFixed(1)} ({space.reviews})
                  </span>
                )}
                {!!space.capacity && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" /> {space.capacity}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 border-t border-border pt-4">
                <span className="text-2xl font-extrabold text-foreground">₹{space.price.toLocaleString('en-IN')}</span>
                <span className="text-sm text-muted-foreground">{space.priceUnit}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Book;
