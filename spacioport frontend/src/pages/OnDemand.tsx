import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Clock, Monitor, Users, Wifi, Coffee, ArrowRight } from 'lucide-react';

const rooms = [
  { name: 'Focus Pod', capacity: '1-2', price: 500, icon: Monitor },
  { name: 'Meeting Room', capacity: '4-8', price: 1200, icon: Users },
  { name: 'Conference Hall', capacity: '10-30', price: 2500, icon: Users },
];

const OnDemand = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <section className="gradient-hero px-4 py-20 text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-4xl font-bold md:text-5xl">On-Demand Spaces</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="mb-8 text-lg opacity-80">
            Book meeting rooms and workspaces by the hour. No commitment, instant access.
          </motion.p>
          <button onClick={() => navigate('/spaces?type=ondemand')} className="gradient-cta flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold text-accent-foreground mx-auto">
            Browse On-Demand Spaces <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-foreground">Hourly Room Options</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {rooms.map((r) => (
            <motion.div key={r.name} whileHover={{ y: -4 }} className="rounded-2xl border border-border bg-card p-8 shadow-card text-center">
              <div className="mb-4 inline-flex rounded-xl bg-primary p-3 text-primary-foreground"><r.icon className="h-6 w-6" /></div>
              <h3 className="mb-1 text-xl font-bold text-card-foreground">{r.name}</h3>
              <p className="mb-3 text-sm text-muted-foreground">{r.capacity} people</p>
              <p className="mb-6"><span className="text-3xl font-extrabold text-foreground">₹{r.price.toLocaleString('en-IN')}</span><span className="text-muted-foreground">/hour</span></p>
              <div className="mb-6 flex justify-center gap-3 text-muted-foreground">
                <Wifi className="h-4 w-4" /><Coffee className="h-4 w-4" /><Monitor className="h-4 w-4" />
              </div>
              <button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="gradient-cta w-full rounded-xl py-3 font-bold text-accent-foreground">
                Instant Booking
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OnDemand;
