import { useState } from 'react';
import { AppNavbar } from '@/components/AppNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { storage } from '@/services/storageManager';
import { Settings as SettingsIcon, Bell, Lock, Trash2, Download, Upload, Sun, Moon, User, RotateCcw, Palette } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { startOnboarding } = useOnboarding();
  
  const [preferences, setPreferences] = useState(user?.preferences || {
    theme: 'blue',
    autosave: true,
    notifications: true,
  });

  const handlePreferenceChange = (key: string, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    
    if (user) {
      updateProfile({ preferences: newPrefs });
      toast.success('Preference updated');
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarUrl = reader.result as string;
        updateProfile({ avatar: avatarUrl });
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = () => {
    const data = {
      user: storage.getUser(),
      projects: storage.getProjects(),
      reviews: storage.getReviews(),
      analytics: storage.getAnalytics(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creatorflow-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const handleClearData = () => {
    if (!confirm('Are you sure? This will delete all your projects and data. This cannot be undone.')) {
      return;
    }

    storage.clearAllData();
    toast.success('All data cleared');
    logout();
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('creatorflow_onboarding_completed');
    toast.success('Tutorial reset! Refresh to start again.');
    setTimeout(() => startOnboarding(), 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <div className="container py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your app preferences and data</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Profile</h2>
              </div>

              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </span>
                      </Button>
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Username</Label>
                    <p className="text-base mt-1">{user?.username || 'UserFallbackName'}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Email</Label>
                    <p className="text-base mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Plan</Label>
                    <p className="text-base mt-1 capitalize">{user?.plan}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Data Management */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Data Management</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="font-medium">Export All Data</p>
                    <p className="text-sm text-muted-foreground">
                      Download all your projects and settings as JSON
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-destructive">Clear All Data</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete all projects and data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleClearData}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Data
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Theme</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Theme Preview */}
                <div className="p-4 rounded-lg border bg-card">
                  <p className="text-sm font-medium mb-3">Preview</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-12 rounded bg-primary" />
                    <div className="h-12 rounded bg-secondary" />
                    <div className="h-12 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Reset Options */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Reset Options</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reset Tutorial</p>
                    <p className="text-sm text-muted-foreground">
                      Show the onboarding tutorial again
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleResetOnboarding}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Editor Preferences</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save projects</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes while editing
                    </p>
                  </div>
                  <Switch
                    checked={preferences.autosave}
                    onCheckedChange={(checked) => handlePreferenceChange('autosave', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications for exports and saves
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                  />
                </div>
              </div>
            </Card>

            {/* Privacy Info */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Privacy & Storage</h2>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p>
                    All your data is stored locally on your device using browser storage
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p>
                    Your projects, videos, and personal information never leave your device
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p>
                    We recommend exporting your data regularly as a backup
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
