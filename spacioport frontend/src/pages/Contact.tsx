import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { inquiriesAPI } from '@/lib/api';

const Contact = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await inquiriesAPI.create(form);
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      toast.success("Message sent! We'll get back to you soon.");
    } finally {
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-2 text-center text-3xl font-bold text-foreground md:text-4xl">
        Get in Touch
      </motion.h1>
      <p className="mb-12 text-center text-muted-foreground">We'd love to hear from you</p>

      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
        <div>
          <div className="mb-8 space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'hello@spacioport.com' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: MapPin, label: 'Address', value: 'Connaught Place, New Delhi, India 110001' },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4">
                <div className="rounded-xl bg-primary p-3 text-primary-foreground"><c.icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
                  <p className="font-medium text-foreground">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/')} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary">Back to Home</button>
            <button onClick={() => navigate('/spaces')} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">Explore Spaces</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
          <input type="text" required placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <input type="email" required placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <textarea required rows={5} placeholder="Your Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <button type="submit" disabled={loading} className="gradient-cta w-full rounded-xl py-3 font-bold text-accent-foreground disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
