import { useState } from 'react';
import { AppNavbar } from '@/components/AppNavbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Download, Play, Star, Eye, Heart, TrendingUp, Sparkles, Video, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface CommunityPost {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  thumbnail: string;
  category: 'template' | 'tutorial' | 'tip';
  views: number;
  likes: number;
  rating: number;
  description: string;
}

export default function Community() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [importedAssets, setImportedAssets] = useState<Set<string>>(new Set());

  const mockPosts: CommunityPost[] = [
    {
      id: '1',
      title: 'Viral TikTok Story Template',
      author: user?.username || 'CreatorPro',
      thumbnail: '/placeholder.svg',
      category: 'template',
      views: 12500,
      likes: 890,
      rating: 4.8,
      description: 'Engaging story format perfect for short-form content',
    },
    {
      id: '2',
      title: 'How to Add Dynamic Captions',
      author: 'AICreator',
      thumbnail: '/placeholder.svg',
      category: 'tutorial',
      views: 8200,
      likes: 650,
      rating: 4.9,
      description: 'Step-by-step guide to animated text overlays',
    },
    {
      id: '3',
      title: 'Product Review Layout',
      author: 'ReviewMaster',
      thumbnail: '/placeholder.svg',
      category: 'template',
      views: 15000,
      likes: 1200,
      rating: 4.7,
      description: 'Professional template for product reviews',
    },
    {
      id: '4',
      title: '5 Tips for Better Transitions',
      author: user?.username || 'CreatorPro',
      thumbnail: '/placeholder.svg',
      category: 'tip',
      views: 5600,
      likes: 420,
      rating: 4.6,
      description: 'Quick tips to make your edits smoother',
    },
    {
      id: '5',
      title: 'Tutorial Intro Template',
      author: 'TutorialPro',
      thumbnail: '/placeholder.svg',
      category: 'template',
      views: 9800,
      likes: 780,
      rating: 4.8,
      description: 'Eye-catching intro for tutorial videos',
    },
    {
      id: '6',
      title: 'Mastering AI Voiceovers',
      author: 'VoiceAI',
      thumbnail: '/placeholder.svg',
      category: 'tutorial',
      views: 11200,
      likes: 950,
      rating: 4.9,
      description: 'Complete guide to AI voice generation',
    },
  ];

  const handleImport = (post: CommunityPost) => {
    const newImported = new Set(importedAssets);
    let finalTitle = post.title;
    let counter = 1;
    
    // Handle duplicates with auto-rename
    while (newImported.has(finalTitle)) {
      finalTitle = `${post.title} (${counter})`;
      counter++;
    }
    
    newImported.add(finalTitle);
    setImportedAssets(newImported);
    
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-medium">Added to Editor</span>
        <span className="text-xs text-muted-foreground">{finalTitle}</span>
      </div>
    );
  };

  const toggleFilter = (filter: string) => {
    if (filter === 'all') {
      setActiveFilters(['all']);
    } else {
      const newFilters = activeFilters.filter(f => f !== 'all');
      if (activeFilters.includes(filter)) {
        const filtered = newFilters.filter(f => f !== filter);
        setActiveFilters(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setActiveFilters([...newFilters, filter]);
      }
    }
  };

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilters.includes('all') || activeFilters.includes(post.category);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <div className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Community Hub</h1>
              <p className="text-muted-foreground">Templates, tutorials, and tips from creators</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates, tutorials, and tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All', icon: Sparkles },
              { id: 'template', label: 'Templates', icon: Video },
              { id: 'tutorial', label: 'Tutorials', icon: Play },
              { id: 'tip', label: 'Tips', icon: TrendingUp },
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilters.includes(filter.id) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleFilter(filter.id)}
                className="gap-1.5"
              >
                <filter.icon className="h-3.5 w-3.5" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-16 w-16 text-primary/40" />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="capitalize">
                    {post.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-1">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {post.description}
                </p>

                {/* Author */}
                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    {post.author[0].toUpperCase()}
                  </div>
                  <span>{post.author}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {post.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    {post.likes.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    {post.rating}
                  </div>
                </div>

                {/* Actions */}
                <Button
                  onClick={() => handleImport(post)}
                  className="w-full gap-2"
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                  Import to Editor
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <Card className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
