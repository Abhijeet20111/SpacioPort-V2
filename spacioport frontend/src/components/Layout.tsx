import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Building2, Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Spaces', to: '/spaces' },
    { label: 'Virtual Offices', to: '/virtual-offices' },
    { label: 'Long-Term', to: '/long-term-leasing' },
    { label: 'On-Demand', to: '/on-demand' },
    { label: 'Promote', to: '/promote' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Building2 className="h-7 w-7" />
          SpacioPort
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')} className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80">
                <User className="h-4 w-4" /> {user?.name}
              </button>
              <button onClick={logout} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary">
                Login
              </Link>
              <Link to="/register" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border bg-card lg:hidden">
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                  {l.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {isAuthenticated ? (
                <>
                  <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium">Dashboard</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="border-t border-border bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Building2 className="h-5 w-5" /> SpacioPort
          </div>
          <p className="text-sm opacity-70">Your gateway to flexible workspaces and business growth.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">Solutions</h4>
          <div className="flex flex-col gap-2 text-sm opacity-80">
            <Link to="/virtual-offices" className="hover:opacity-100">Virtual Offices</Link>
            <Link to="/long-term-leasing" className="hover:opacity-100">Long-Term Leasing</Link>
            <Link to="/on-demand" className="hover:opacity-100">On-Demand Spaces</Link>
            <Link to="/promote" className="hover:opacity-100">Promote</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">Company</h4>
          <div className="flex flex-col gap-2 text-sm opacity-80">
            <Link to="/about" className="hover:opacity-100">About Us</Link>
            <Link to="/contact" className="hover:opacity-100">Contact</Link>
            <Link to="/spaces" className="hover:opacity-100">All Spaces</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider opacity-70">Account</h4>
          <div className="flex flex-col gap-2 text-sm opacity-80">
            <Link to="/login" className="hover:opacity-100">Login</Link>
            <Link to="/register" className="hover:opacity-100">Register</Link>
            <Link to="/dashboard" className="hover:opacity-100">Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-sm opacity-60">
        © 2026 SpacioPort. All rights reserved.
      </div>
    </div>
  </footer>
);

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
