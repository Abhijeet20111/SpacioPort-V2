import { motion } from 'framer-motion';
import { Building, Users, Calendar, Megaphone, Loader2, Plus, X, Trash2, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { spacesAPI, bookingsAPI, campaignsAPI, inquiriesAPI } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const tabs = ['Manage Spaces', 'Manage Bookings', 'Manage Inquiries', 'Manage Promotions'];
const icons = [Building, Calendar, Users, Megaphone];

const cityOptions = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Gurgaon', 'Noida', 'Ahmedabad'];
const amenityOptions = ['WiFi', 'Meeting Rooms', 'Pantry', 'Parking', '24/7 Access', 'Printer', 'Whiteboard', 'Tea/Coffee', 'Monitor', 'Video Conferencing', 'AC', 'Bike Parking', 'Terrace', 'Event Space', 'Lab Space', '3D Printer', 'Podcast Studio', 'Phone Answering', 'Mail Handling', 'Business Address', 'Meeting Room Credits', 'Locker'];

interface SpaceForm {
  name: string;
  type: 'virtual' | 'physical';
  duration: '' | 'long-term' | 'on-demand';
  city: string;
  address: string;
  price: string;
  priceUnit: string;
  discount: string;
  capacity: string;
  image: string;
  images: string;
  amenities: string[];
  description: string;
  rating: string;
  reviews: string;
}

const emptyForm: SpaceForm = {
  name: '',
  type: 'physical',
  duration: 'long-term',
  city: 'Delhi',
  address: '',
  price: '',
  priceUnit: '/month',
  discount: '0',
  capacity: '1',
  image: '',
  images: '',
  amenities: [],
  description: '',
  rating: '0',
  reviews: '0',
};

interface SpaceRow {
  _id: string;
  name: string;
  type: string;
  duration?: string;
  city?: string;
  address?: string;
  price: number;
  priceUnit: string;
  capacity: number;
  image?: string;
  images?: string[];
  amenities?: string[];
  description?: string;
  discount?: number;
  rating?: number;
  reviews?: number;
}

const Admin = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Spaces state
  const [spaces, setSpaces] = useState<SpaceRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SpaceForm>({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Other tabs
  const [bookings, setBookings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (tab === 0) {
          const res = await spacesAPI.list({ limit: 100 });
          if (res.data.success) setSpaces(res.data.data);
        } else if (tab === 1) {
          const res = await bookingsAPI.list();
          if (res.data.success) setBookings(res.data.data);
        } else if (tab === 2) {
          const res = await inquiriesAPI.list();
          if (res.data.success) setInquiries(res.data.data);
        } else if (tab === 3) {
          const res = await campaignsAPI.list();
          if (res.data.success) setCampaigns(res.data.data);
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to load data. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab, refreshKey]);

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const handleToggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleEdit = (s: SpaceRow) => {
    setEditingId(s._id);
    setForm({
      name: s.name || '',
      type: (s.type as 'virtual' | 'physical') || 'physical',
      duration: (s.duration as SpaceForm['duration']) || (s.type === 'virtual' ? '' : 'long-term'),
      city: s.city || 'Delhi',
      address: s.address || '',
      price: String(s.price ?? ''),
      priceUnit: s.priceUnit || '/month',
      discount: String(s.discount ?? 0),
      capacity: String(s.capacity ?? 1),
      image: s.image || '',
      images: (s.images || []).join(', '),
      amenities: s.amenities || [],
      description: s.description || '',
      rating: String(s.rating ?? 0),
      reviews: String(s.reviews ?? 0),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!form.name.trim()) return toast.error('Name is required.');
    if (!form.price) return toast.error('Price is required.');
    if (form.type === 'physical') {
      if (!form.city) return toast.error('City is required for physical spaces.');
      if (!form.address.trim()) return toast.error('Address is required for physical spaces.');
      if (!form.duration) return toast.error('Duration is required for physical spaces.');
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        type: form.type,
        price: Number(form.price),
        priceUnit: form.priceUnit,
        discount: Number(form.discount) || 0,
        capacity: Number(form.capacity) || 1,
        image: form.image.trim() || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
        images: form.images
          ? form.images.split(',').map((u) => u.trim()).filter(Boolean)
          : [],
        amenities: form.amenities,
        description: form.description.trim(),
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
      };

      if (form.type === 'physical') {
        payload.city = form.city;
        payload.address = form.address.trim();
        payload.location = form.address.trim();
        payload.duration = form.duration;
      } else {
        // Virtual: city is optional, no address/duration required
        payload.city = form.city || undefined;
        payload.address = '';
        payload.location = '';
        payload.duration = undefined;
      }

      if (editingId) {
        await spacesAPI.update(editingId, payload);
        toast.success('Space updated successfully!');
      } else {
        await spacesAPI.create(payload);
        toast.success('Space created successfully!');
      }
      setShowForm(false);
      resetForm();
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save space.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await spacesAPI.delete(deleteId); // soft delete on backend
      toast.success('Space deactivated.');
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete space.');
    } finally {
      setDeleteId(null);
    }
  };

  const formatType = (s: SpaceRow) => {
    if (s.type === 'virtual') return 'Virtual';
    if (s.type === 'physical') {
      return s.duration === 'long-term' ? 'Physical · Long-Term' : s.duration === 'on-demand' ? 'Physical · On-Demand' : 'Physical';
    }
    return s.type;
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-3xl font-bold text-foreground">
        Admin Dashboard
      </motion.h1>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {tabs.map((t, i) => {
          const Icon = icons[i];
          return (
            <button
              key={t}
              onClick={() => { setTab(i); setShowForm(false); resetForm(); }}
              className={`flex flex-col items-center gap-2 rounded-xl border p-5 text-center transition ${i === tab ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">{t}</span>
            </button>
          );
        })}
      </div>

      {/* ============ MANAGE SPACES ============ */}
      {tab === 0 && (
        <>
          <div className="mb-6">
            <button
              onClick={() => {
                if (showForm) { setShowForm(false); resetForm(); }
                else { resetForm(); setShowForm(true); }
              }}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? 'Cancel' : 'Add New Space'}
            </button>
          </div>

          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleSubmit}
              className="mb-8 rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <h2 className="mb-6 text-xl font-bold text-foreground">
                {editingId ? 'Edit Space' : 'Add New Space'}
              </h2>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {/* Name */}
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="name">Title / Name *</Label>
                  <Input id="name" placeholder="e.g. Skyline Co-Work" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={(e) => {
                      const newType = e.target.value as 'virtual' | 'physical';
                      setForm((f) => ({
                        ...f,
                        type: newType,
                        // Reset physical-only fields when switching
                        ...(newType === 'virtual'
                          ? { duration: '', address: '' }
                          : { duration: f.duration || 'long-term' }),
                      }));
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="virtual">Virtual</option>
                    <option value="physical">Physical</option>
                  </select>
                </div>

                {/* Duration — physical only */}
                {form.type === 'physical' && (
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <select
                      id="duration"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value as SpaceForm['duration'] })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="long-term">Long-Term</option>
                      <option value="on-demand">On-Demand</option>
                    </select>
                  </div>
                )}

                {/* City — required for physical */}
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City {form.type === 'physical' ? '*' : '(optional)'}
                  </Label>
                  <select
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {form.type === 'virtual' && <option value="">— None —</option>}
                    {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Address — physical only */}
                {form.type === 'physical' && (
                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      placeholder="e.g. Connaught Place, Central Delhi"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      required
                    />
                  </div>
                )}

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input id="price" type="number" min={0} placeholder="25000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>

                {/* Price Unit */}
                <div className="space-y-2">
                  <Label htmlFor="priceUnit">Price Unit</Label>
                  <select id="priceUnit" value={form.priceUnit} onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="/month">/month</option>
                    <option value="/hour">/hour</option>
                    <option value="/day">/day</option>
                    <option value="/year">/year</option>
                  </select>
                </div>

                {/* Discount */}
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input id="discount" type="number" min={0} max={100} value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" min={1} placeholder="50" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input id="rating" type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </div>

                {/* Reviews count */}
                <div className="space-y-2">
                  <Label htmlFor="reviews">Reviews count</Label>
                  <Input id="reviews" type="number" min={0} value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} />
                </div>

                {/* Main Image URL */}
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="image">Main Image URL</Label>
                  <Input id="image" placeholder="https://images.unsplash.com/..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                </div>

                {/* Additional Images */}
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="images">Additional Image URLs (comma-separated)</Label>
                  <Input id="images" placeholder="https://url1.com/img.jpg, https://url2.com/img.jpg" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the workspace..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                {/* Amenities */}
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label>Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {amenityOptions.map((a) => (
                      <button
                        type="button"
                        key={a}
                        onClick={() => handleToggleAmenity(a)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${form.amenities.includes(a) ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-secondary text-muted-foreground hover:text-foreground'}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button type="submit" disabled={submitting}
                  className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                  {submitting ? 'Saving…' : editingId ? 'Update Space' : 'Create Space'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
                  className="rounded-xl border border-border px-6 py-3 font-semibold text-foreground transition hover:bg-secondary">
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          {/* Spaces table */}
          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-secondary">
                  <tr>
                    {['Title', 'Type', 'City', 'Price', 'Capacity', 'Actions'].map((c) => (
                      <th key={c} className="px-5 py-3 font-semibold text-secondary-foreground">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {spaces.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No spaces yet.</td></tr>
                  ) : spaces.map((s) => (
                    <tr key={s._id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-5 py-3 font-medium text-foreground">{s.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{formatType(s)}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.city || '—'}</td>
                      <td className="px-5 py-3 text-foreground">₹{s.price.toLocaleString('en-IN')}{s.priceUnit}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.capacity}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(s)}
                            className="rounded-lg p-2 text-primary transition hover:bg-primary/10"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(s._id)}
                            className="rounded-lg p-2 text-destructive transition hover:bg-destructive/10"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ============ MANAGE BOOKINGS ============ */}
      {tab === 1 && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary">
                <tr>
                  {['Name', 'Phone', 'Email', 'Space', 'Date', 'Status'].map((c) => (
                    <th key={c} className="px-5 py-3 font-semibold text-secondary-foreground">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No bookings yet.</td></tr>
                ) : bookings.map((b) => (
                  <tr key={b._id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium text-foreground">{b.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.phone}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.email}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.space?.name || '—'}</td>
                    <td className="px-5 py-3 text-muted-foreground">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        b.status === 'confirmed' ? 'bg-success/10 text-success' :
                        b.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                        b.status === 'contacted' ? 'bg-primary/10 text-primary' :
                        'bg-muted text-muted-foreground'
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ============ INQUIRIES ============ */}
      {tab === 2 && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary">
                <tr>{['Name', 'Email', 'Subject', 'Status'].map((c) => <th key={c} className="px-5 py-3 font-semibold text-secondary-foreground">{c}</th>)}</tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">No inquiries.</td></tr>
                ) : inquiries.map((i: any) => (
                  <tr key={i._id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium text-foreground">{i.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{i.email}</td>
                    <td className="px-5 py-3 text-muted-foreground">{i.subject || '—'}</td>
                    <td className="px-5 py-3 text-muted-foreground capitalize">{i.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ============ CAMPAIGNS ============ */}
      {tab === 3 && (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary">
                <tr>{['Campaign', 'Budget', 'Audience', 'Status'].map((c) => <th key={c} className="px-5 py-3 font-semibold text-secondary-foreground">{c}</th>)}</tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">No campaigns.</td></tr>
                ) : campaigns.map((c: any) => (
                  <tr key={c._id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">₹{c.budget?.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3 text-muted-foreground">{c.targetAudience}</td>
                    <td className="px-5 py-3 text-muted-foreground capitalize">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Soft delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this space?</AlertDialogTitle>
            <AlertDialogDescription>
              The space will be deactivated (soft-deleted) and hidden from public listings.
              You can reactivate it later by setting <code>isActive</code> back to true in the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
