import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Video, LayoutDashboard, User, Star, Settings, LogOut, Menu, X, Users } from 'lucide-react';
import { useState } from 'react';

export const AppNavbar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/editor', label: 'Editor', icon: Video },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/reviews', label: 'Reviews', icon: Star },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Video className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">CreatorFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{user?.username || 'UserFallbackName'}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.plan} Plan</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => logout()}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(link.path) ? 'default' : 'ghost'}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border/40 space-y-2">
              <div className="flex items-center gap-3 px-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.username || 'UserFallbackName'}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.plan} Plan</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
