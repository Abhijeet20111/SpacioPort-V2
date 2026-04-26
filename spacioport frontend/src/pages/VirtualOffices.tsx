import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, MapPin, Phone, ArrowRight, Check } from 'lucide-react';

const tiers = [
  { name: 'Starter', price: 2999, features: ['Business Address', 'Mail Handling', '5 Meeting Room Hours'] },
  { name: 'Professional', price: 5999, features: ['Everything in Starter', 'Phone Answering', '15 Meeting Room Hours', 'Dedicated Phone Number'], popular: true },
  { name: 'Enterprise', price: 11999, features: ['Everything in Professional', 'Unlimited Meeting Rooms', 'Reception Services', 'Priority Support'] },
];

const VirtualOffices = () => {
  const navigate = useNavigate();

  return (
    <div>
      <section className="gradient-hero px-4 py-20 text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-4xl font-bold md:text-5xl">Virtual Offices</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="mb-8 text-lg opacity-80">
            A prestigious business address without the overhead. Perfect for remote teams and growing startups.
          </motion.p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button onClick={() => navigate('/spaces?type=virtual')} className="gradient-cta flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold text-accent-foreground">
              <MapPin className="h-5 w-5" /> View Available Cities
            </button>
            <button onClick={() => navigate('/contact')} className="glass rounded-xl px-8 py-3.5 font-bold">Contact Sales</button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-foreground">Choose Your Plan</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <motion.div key={t.name} whileHover={{ y: -4 }}
              className={`relative rounded-2xl border p-8 ${t.popular ? 'border-accent bg-accent/5 shadow-card-hover' : 'border-border bg-card shadow-card'}`}>
              {t.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-accent-foreground">Most Popular</span>}
              <h3 className="mb-2 text-xl font-bold text-card-foreground">{t.name}</h3>
              <p className="mb-6"><span className="text-3xl font-extrabold text-foreground">₹{t.price.toLocaleString('en-IN')}</span><span className="text-muted-foreground">/month</span></p>
              <ul className="mb-6 space-y-2">
                {t.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-success" /> {f}</li>)}
              </ul>
              <button onClick={() => navigate('/register')} className={`w-full rounded-xl py-3 font-bold transition ${t.popular ? 'gradient-cta text-accent-foreground' : 'bg-primary text-primary-foreground hover:opacity-90'}`}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VirtualOffices;
