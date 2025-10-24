import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Video, Sparkles, Zap, Users, Star, Check } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Video className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">CreatorFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Star className="h-4 w-4 fill-primary" />
            AI-Powered Video Creation Platform
          </div>
          
          <h1 className="mb-6 text-4xl md:text-6xl font-bold leading-tight">
            Create Viral Videos with{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              AI Power
            </span>
          </h1>
          
          <p className="mb-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            The easiest way to make professional videos for TikTok, Instagram, and YouTube Shorts. 
            No experience needed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Sparkles className="h-5 w-5" />
                Start Creating Free
              </Button>
            </Link>
            <Link to="/reviews">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                See Reviews
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ No credit card required</span>
            <span>✓ Works offline</span>
            <span>✓ 100% private</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 border-t border-border/40">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to go viral
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional tools powered by AI, designed for creators
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Script Generation</h3>
            <p className="text-muted-foreground">
              Generate engaging scripts instantly. Just describe your idea and let AI do the work.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Auto-Edit</h3>
            <p className="text-muted-foreground">
              AI automatically edits your videos with perfect cuts, transitions, and timing.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Template Library</h3>
            <p className="text-muted-foreground">
              Start with proven templates used by top creators. Customize to match your style.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container py-20 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by creators worldwide</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">10K+</p>
              <p className="text-sm text-muted-foreground">Active Creators</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">150K+</p>
              <p className="text-sm text-muted-foreground">Videos Created</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">4.8★</p>
              <p className="text-sm text-muted-foreground">User Rating</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">2.5M+</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container py-20 border-t border-border/40">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start free, upgrade when you're ready
          </h2>
          <p className="text-lg text-muted-foreground">
            No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="p-8 rounded-2xl border-2 border-border bg-card">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-muted-foreground mb-6">Perfect to get started</p>
            <p className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Unlimited projects</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Local storage</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Basic templates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Limited AI credits</span>
              </li>
            </ul>

            <Link to="/signup" className="block">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          {/* Professional */}
          <div className="p-8 rounded-2xl border-2 border-primary bg-card shadow-lg shadow-primary/20 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Professional</h3>
            <p className="text-muted-foreground mb-6">For serious creators</p>
            <p className="text-4xl font-bold mb-6">$19<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>100 AI credits/month</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Priority support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Advanced templates</span>
              </li>
            </ul>

            <Link to="/signup" className="block">
              <Button className="w-full">Start Free Trial</Button>
            </Link>
          </div>

          {/* Creator */}
          <div className="p-8 rounded-2xl border-2 border-border bg-card">
            <h3 className="text-2xl font-bold mb-2">Creator</h3>
            <p className="text-muted-foreground mb-6">For power users</p>
            <p className="text-4xl font-bold mb-6">$49<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Unlimited AI credits</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Custom branding</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>API access</span>
              </li>
            </ul>

            <Link to="/signup" className="block">
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 border-t border-border/40">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-12 border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to create amazing videos?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of creators making viral content with CreatorFlow
          </p>
          <Link to="/signup">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Start Creating Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Video className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">CreatorFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create viral videos with AI-powered tools. Fast, easy, and private.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/signup" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/reviews" className="hover:text-primary transition-colors">Reviews</Link></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>© 2025 CreatorFlow. All rights reserved. Built with local-first technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
