import { useState } from 'react';
import { AppNavbar } from '@/components/AppNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Crown, Video } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'creator':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'professional':
        return 'bg-gradient-to-r from-primary to-blue-600';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <div className="container py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white text-4xl font-bold mb-4">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold">{user?.username}</h2>
                  <Badge className={`${getPlanColor(user?.plan || 'free')} text-white border-0`}>
                    {user?.plan === 'creator' && <Crown className="h-3 w-3 mr-1" />}
                    {user?.plan.toUpperCase()}
                  </Badge>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Joined {new Date(user?.createdAt || '').toLocaleDateString()}
                      </span>
                    </div>
                    <Button onClick={() => setIsEditing(true)} className="mt-4">
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Videos Created</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Exports</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Credits Used</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Plan Details */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Current Plan</h3>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-lg font-medium mb-1">
                {user?.plan === 'free' && 'Free Plan'}
                {user?.plan === 'professional' && 'Professional Plan'}
                {user?.plan === 'creator' && 'Creator Plan'}
              </p>
              <p className="text-sm text-muted-foreground">
                {user?.plan === 'free' && 'Unlimited projects with local storage'}
                {user?.plan === 'professional' && '$19/month - Enhanced features & priority support'}
                {user?.plan === 'creator' && '$49/month - All features + unlimited AI credits'}
              </p>
            </div>
            {user?.plan === 'free' && (
              <Button>Upgrade Plan</Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-medium">Unlimited Projects</p>
                <p className="text-sm text-muted-foreground">Create as many videos as you want</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-medium">Local Storage</p>
                <p className="text-sm text-muted-foreground">All data stored on your device</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-medium">Template Library</p>
                <p className="text-sm text-muted-foreground">Access to all video templates</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-medium">AI Tools</p>
                <p className="text-sm text-muted-foreground">
                  {user?.plan === 'free' && 'Limited AI credits'}
                  {user?.plan === 'professional' && '100 AI credits/month'}
                  {user?.plan === 'creator' && 'Unlimited AI credits'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
