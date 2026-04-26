import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Building, Clock, Megaphone, MapPin, ArrowRight, Wifi, Users, Coffee } from 'lucide-react';
import { useState } from 'react';
import { cities } from '@/data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const Index = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchType) params.set('type', searchType);
    navigate(`/spaces?${params.toString()}`);
  };

  const solutions = [
    { icon: Building, title: 'Virtual Offices', desc: 'Professional business address, mail handling, and phone services.', to: '/virtual-offices', color: 'bg-primary' },
    { icon: Clock, title: 'Long-Term Leasing', desc: 'Exclusive discounts on dedicated office spaces with flexible terms.', to: '/long-term-leasing', color: 'bg-success' },
    { icon: Coffee, title: 'On-Demand Spaces', desc: 'Meeting rooms and hot desks available by the hour or day.', to: '/on-demand', color: 'bg-accent' },
  ];

  const cityMarkers = cities.map((c, i) => ({
    name: c,
    left: `${15 + (i % 3) * 30}%`,
    top: `${20 + Math.floor(i / 3) * 40}%`,
  }));

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden px-4 py-20 text-primary-foreground md:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920')] bg-cover bg-center opacity-10" />
        <div className="container relative mx-auto max-w-4xl text-center">
          <motion.h1 initial="hidden" animate="visible" custom={0} variants={fadeUp} className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl">
            Your Gateway to Flexible Workspaces & Business Growth
          </motion.h1>
          <motion.p initial="hidden" animate="visible" custom={1} variants={fadeUp} className="mx-auto mb-10 max-w-2xl text-lg opacity-80 md:text-xl">
            Virtual offices, long-term leases with exclusive discounts, and on-demand spaces — plus powerful B2B promotional tools.
          </motion.p>
          <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp} className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button onClick={() => navigate('/spaces')} className="gradient-cta flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-accent-foreground shadow-lg transition hover:opacity-90">
              Find Your Space <ArrowRight className="h-5 w-5" />
            </button>
            <button onClick={() => navigate('/promote')} className="glass flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold transition hover:bg-primary-foreground/20">
              <Megaphone className="h-5 w-5" /> Promote Your Brand
            </button>
          </motion.div>

          {/* Search bar */}
          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl bg-card/10 p-4 backdrop-blur-lg sm:flex-row">
            <select value={searchCity} onChange={(e) => setSearchCity(e.target.value)} className="flex-1 rounded-xl bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none">
              <option value="" className="text-foreground">All Cities</option>
              {cities.map((c) => <option key={c} value={c} className="text-foreground">{c}</option>)}
            </select>
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="flex-1 rounded-xl bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground focus:outline-none">
              <option value="" className="text-foreground">All Types</option>
              <option value="virtual" className="text-foreground">Virtual</option>
              <option value="physical" className="text-foreground">Physical</option>
            </select>
            <button onClick={handleSearch} className="gradient-cta flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-accent-foreground">
              <Search className="h-4 w-4" /> Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* Solutions */}
      <section className="container mx-auto px-4 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12 text-center">
          <motion.h2 variants={fadeUp} custom={0} className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Workspace Solutions</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">Choose the perfect workspace for your needs</motion.p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {solutions.map((s, i) => (
            <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
              onClick={() => navigate(s.to)}
              className="group cursor-pointer rounded-2xl border border-border bg-card p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className={`mb-5 inline-flex rounded-xl ${s.color} p-3 text-primary-foreground`}>
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-card-foreground">{s.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{s.desc}</p>
              <span className="flex items-center gap-1 text-sm font-semibold text-accent transition group-hover:gap-2">
                Learn More <ArrowRight className="h-4 w-4" />
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="mb-3 text-center text-3xl font-bold text-foreground md:text-4xl">
            Find Spaces Near You
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="mb-10 text-center text-muted-foreground">
            Click a city to explore available workspaces
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="relative mx-auto h-64 max-w-3xl overflow-hidden rounded-2xl bg-primary/5 md:h-80"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200')] bg-cover bg-center opacity-20" />
            {cityMarkers.map((c) => (
              <button key={c.name} onClick={() => navigate(`/spaces?city=${c.name}`)}
                className="group absolute flex flex-col items-center transition hover:scale-110"
                style={{ left: c.left, top: c.top }}
              >
                <MapPin className="h-8 w-8 fill-accent text-accent drop-shadow-lg" />
                <span className="mt-1 rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-card-foreground shadow">{c.name}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { num: '500+', label: 'Workspaces' },
            { num: '50+', label: 'Cities' },
            { num: '10K+', label: 'Members' },
            { num: '98%', label: 'Satisfaction' },
          ].map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="text-center">
              <div className="text-3xl font-extrabold text-accent md:text-4xl">{s.num}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero px-4 py-20 text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Transform Your Workspace?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="mb-8 text-lg opacity-80">
            Join thousands of businesses already thriving with SpacioPort.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button onClick={() => navigate('/contact')} className="glass rounded-xl px-8 py-3.5 font-bold transition hover:bg-primary-foreground/20">
              Talk to Our Workspace Expert
            </button>
            <button onClick={() => navigate('/spaces')} className="gradient-cta flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold text-accent-foreground shadow-lg transition hover:opacity-90">
              Explore All Spaces <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
