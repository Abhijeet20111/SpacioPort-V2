import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Building, Calendar, Megaphone, User, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bookingsAPI, wishlistAPI } from '@/lib/api';

const tabs = ['Overview', 'My Spaces', 'My Bookings', 'My Promotions', 'Profile Settings'];

interface Booking {
  _id: string;
  space: { _id?: string; name: string; city?: string } | null;
  name: string;
  email: string;
  phone: string;
  message?: string;
  status: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, wRes] = await Promise.all([
          bookingsAPI.list().catch(() => null),
          wishlistAPI.list().catch(() => null),
        ]);
        if (bRes?.data?.success) setBookings(bRes.data.data);
        if (wRes?.data?.success) setWishlist(wRes.data.data);
      } catch {
        // Backend not running — keep empty
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1 text-3xl font-bold text-foreground">Welcome, {user?.name}</h1>
        <p className="mb-8 text-muted-foreground">Manage your workspaces and bookings</p>
      </motion.div>

      <div className="mb-8 flex gap-2 overflow-x-auto border-b border-border pb-0">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${i === tab ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Building, label: 'Book New Space', action: () => navigate('/spaces'), color: 'bg-primary' },
            { icon: Megaphone, label: 'Create Campaign', action: () => navigate('/promote'), color: 'bg-accent' },
            { icon: Calendar, label: 'Long-Term Spaces', action: () => navigate('/spaces?type=physical&duration=long-term'), color: 'bg-success' },
          ].map((a) => (
            <motion.button key={a.label} whileHover={{ y: -2 }} onClick={a.action}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-card transition hover:shadow-card-hover">
              <div className={`rounded-xl ${a.color} p-3 text-primary-foreground`}><a.icon className="h-6 w-6" /></div>
              <div className="text-left">
                <p className="font-semibold text-card-foreground">{a.label}</p>
                <p className="text-sm text-muted-foreground">Quick action</p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </motion.button>
          ))}

          <div className="md:col-span-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="mb-4 text-lg font-bold">Recent Bookings</h3>
              {loadingBookings ? (
                <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b._id} className="flex items-center justify-between rounded-lg bg-secondary p-4">
                      <div>
                        <p className="font-medium text-foreground">{b.space?.name || 'Space'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(b.createdAt).toLocaleDateString()} • {b.phone}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        b.status === 'confirmed' ? 'bg-success/10 text-success' :
                        b.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                        b.status === 'contacted' ? 'bg-primary/10 text-primary' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-muted-foreground">No bookings yet. <button onClick={() => navigate('/spaces')} className="text-accent underline">Book a space</button></p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="rounded-xl border border-border bg-card p-8">
          {wishlist.length > 0 ? (
            <div className="space-y-3">
              {wishlist.map((w: any) => (
                <div key={w._id} className="flex items-center justify-between rounded-lg bg-secondary p-4">
                  <div>
                    <p className="font-medium text-foreground">{w.space?.name || 'Space'}</p>
                    <p className="text-sm text-muted-foreground">{w.space?.city}</p>
                  </div>
                  <button onClick={() => navigate(`/space/${w.space?._id}`)} className="text-sm font-medium text-accent">View</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No saved spaces yet. <button onClick={() => navigate('/spaces')} className="text-accent underline">Browse spaces</button></p>
          )}
        </div>
      )}
      {tab === 2 && (
        <div className="rounded-xl border border-border bg-card p-8">
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b._id} className="flex items-center justify-between rounded-lg bg-secondary p-4">
                  <div>
                    <p className="font-medium text-foreground">{b.space?.name || 'Space'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(b.createdAt).toLocaleDateString()} • {b.phone} • {b.email}
                    </p>
                    {b.message && <p className="mt-1 text-xs text-muted-foreground">"{b.message}"</p>}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    b.status === 'confirmed' ? 'bg-success/10 text-success' :
                    b.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                    b.status === 'contacted' ? 'bg-primary/10 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No bookings yet. <button onClick={() => navigate('/spaces')} className="text-accent underline">Book a space</button></p>
          )}
        </div>
      )}
      {tab === 3 && <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">No promotions yet. <button onClick={() => navigate('/promote')} className="text-accent underline">Create a campaign</button></div>}
      {tab === 4 && (
        <div className="max-w-lg rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><User className="h-6 w-6" /></div>
            <div>
              <p className="font-semibold text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Role: <span className="font-medium capitalize text-foreground">{user?.role}</span></p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
