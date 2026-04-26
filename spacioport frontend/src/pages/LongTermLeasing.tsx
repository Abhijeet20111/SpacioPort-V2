import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingDown, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const LongTermLeasing = () => {
  const navigate = useNavigate();
  const [months, setMonths] = useState(6);
  const basePrice = 25000;
  const discount = months >= 12 ? 25 : months >= 6 ? 15 : 5;
  const saved = basePrice * months * (discount / 100);

  return (
    <div>
      <section className="gradient-hero px-4 py-20 text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-4xl font-bold md:text-5xl">Long-Term Leasing</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="mb-8 text-lg opacity-80">
            Commit longer, save more. Exclusive discounts on dedicated office spaces with flexible terms.
          </motion.p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button onClick={() => navigate('/spaces?type=longterm')} className="gradient-cta flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold text-accent-foreground">
              Explore Offices <ArrowRight className="h-5 w-5" />
            </button>
            <button onClick={() => navigate('/contact')} className="glass rounded-xl px-8 py-3.5 font-bold">Request Consultation</button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 shadow-card">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground"><TrendingDown className="h-6 w-6 text-success" /> Savings Calculator</h2>
          <label className="mb-2 block text-sm font-medium">Lease Duration: <span className="font-bold text-accent">{months} months</span></label>
          <input type="range" min={1} max={24} value={months} onChange={(e) => setMonths(Number(e.target.value))}
            className="mb-6 w-full accent-accent" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-2xl font-bold text-foreground">{discount}%</p>
              <p className="text-xs text-muted-foreground">Discount</p>
            </div>
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-2xl font-bold text-foreground">₹{(basePrice * (1 - discount / 100)).toLocaleString('en-IN')}</p>
              <p className="text-xs text-muted-foreground">Monthly Rate</p>
            </div>
            <div className="rounded-xl bg-success/10 p-4">
              <p className="text-2xl font-bold text-success">₹{saved.toLocaleString('en-IN')}</p>
              <p className="text-xs text-muted-foreground">Total Saved</p>
            </div>
          </div>
          <button onClick={() => navigate('/register')} className="gradient-cta mt-6 w-full rounded-xl py-3 font-bold text-accent-foreground">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default LongTermLeasing;
