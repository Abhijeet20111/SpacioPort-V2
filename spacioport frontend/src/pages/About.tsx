import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Heart, Globe, Users } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div>
      <section className="gradient-hero px-4 py-20 text-primary-foreground">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-4xl font-bold md:text-5xl">About SpacioPort</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="text-lg opacity-80">
            Redefining how businesses find, book, and grow with flexible workspaces.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold text-foreground">Our Story</h2>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            Founded in 2025, SpacioPort was born from a simple observation: businesses waste too much time and money on rigid office leases. We built a platform that connects companies of all sizes with flexible workspace solutions — from virtual offices to dedicated long-term spaces.
          </p>
          <p className="mb-12 leading-relaxed text-muted-foreground">
            Today, we serve over 5,000 members across 20+ cities, helping them work smarter, grow faster, and connect with like-minded professionals.
          </p>

          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To make premium workspaces accessible to every business, everywhere.' },
              { icon: Heart, title: 'Our Values', desc: 'Flexibility, transparency, community, and innovation drive everything we do.' },
              { icon: Globe, title: 'Global Reach', desc: 'Present in 50+ cities with plans to expand to 100+ by 2027.' },
              { icon: Users, title: 'Community First', desc: 'We foster connections between members through events and networking.' },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6 shadow-card">
                <v.icon className="mb-3 h-8 w-8 text-accent" />
                <h3 className="mb-2 text-lg font-bold text-card-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button onClick={() => navigate('/spaces')} className="gradient-cta rounded-xl px-8 py-3 font-bold text-accent-foreground">Explore Spaces</button>
            <button onClick={() => navigate('/contact')} className="rounded-xl border border-border px-8 py-3 font-semibold text-foreground transition hover:bg-secondary">Contact Us</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
