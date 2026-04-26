import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Megaphone, Target, BarChart3, Zap, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { campaignsAPI } from '@/lib/api';

const Promote = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Core fields (2nd code)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('1000');
  const [targetCities, setTargetCities] = useState('');
  const [category, setCategory] = useState('banner');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('draft');

  // Added from 1st code (IMPORTANT)
  const [audience, setAudience] = useState('startup');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    if (!title) {
      toast.error('Title is required.');
      return;
    }

    if (!budget || Number(budget) < 0) {
      toast.error('Budget must be a valid positive number.');
      return;
    }

    setLoading(true);

    try {
      await campaignsAPI.create({
        title,
        description,
        budget: Number(budget),

        // from 2nd code
        targetCities: targetCities
          .split(',')
          .map((city) => city.trim())
          .filter(Boolean),

        category,
        startDate: startDate || null,
        endDate: endDate || null,
        status,

        // added from 1st code (missing business logic improvement)
        targetAudience: audience,
      });

      toast.success('Campaign created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to create campaign'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HERO */}
      <section className="gradient-hero px-4 py-20 text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold md:text-5xl"
          >
            <Megaphone className="mb-2 inline-block h-10 w-10" /> Promote Your Brand
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="mb-8 text-lg opacity-80"
          >
            Reach thousands of business professionals through SpacioPort's B2B promotional network.
          </motion.p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {[
            {
              icon: Target,
              title: 'Targeted Reach',
              desc: 'Access our network of 10K+ business professionals',
            },
            {
              icon: BarChart3,
              title: 'Real-Time Analytics',
              desc: 'Track campaign performance with detailed dashboards',
            },
            {
              icon: Zap,
              title: 'Quick Launch',
              desc: 'Set up and launch campaigns in minutes',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <f.icon className="mb-3 h-8 w-8 text-accent" />
              <h3 className="mb-2 text-lg font-bold text-card-foreground">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 shadow-card">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Campaign Builder
          </h2>

          <div className="space-y-4">

            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Spring Launch 2026"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="mb-1 block text-sm font-medium">Budget (₹)</label>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* ADDED FROM 1st CODE → Audience */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Target Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="startup">Startups</option>
                <option value="enterprise">Enterprise</option>
                <option value="freelancer">Freelancers</option>
              </select>
            </div>

            {/* Cities */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Target Cities
              </label>
              <input
                type="text"
                value={targetCities}
                onChange={(e) => setTargetCities(e.target.value)}
                placeholder="Delhi, Mumbai, Bangalore"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring"
              >
                <option value="banner">Banner</option>
                <option value="featured">Featured</option>
                <option value="newsletter">Newsletter</option>
                <option value="event">Event</option>
                <option value="social">Social</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="gradient-cta flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-accent-foreground disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Build Campaign'}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate('/contact')}
            className="rounded-xl border border-border bg-card px-6 py-3 font-semibold"
          >
            Contact Marketing Team
          </button>

          <button
            onClick={() => navigate('/spaces')}
            className="text-sm font-medium text-accent"
          >
            Explore Workspaces →
          </button>
        </div>
      </section>
    </div>
  );
};

export default Promote;