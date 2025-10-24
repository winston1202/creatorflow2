import { useState } from 'react';
import { AppNavbar } from '@/components/AppNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { storage } from '@/services/storageManager';
import { Settings as SettingsIcon, Bell, Lock, Trash2, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user, logout } = useAuth();
  const [preferences, setPreferences] = useState(user?.preferences || {
    theme: 'blue',
    autosave: true,
    notifications: true,
  });

  const handlePreferenceChange = (key: string, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    
    // Save to storage
    if (user) {
      storage.saveUser({ ...user, preferences: newPrefs });
      toast.success('Preference updated');
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

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <div className="container py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your app preferences and data</p>
        </div>

        {/* Preferences */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Preferences</h2>
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

        {/* Data Management */}
        <Card className="p-6 mb-6">
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

            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <p className="font-medium">Import Data</p>
                <p className="text-sm text-muted-foreground">
                  Restore data from a previous export
                </p>
              </div>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
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

        {/* Storage Info */}
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
                All your data is stored locally on your device using browser storage (localStorage and IndexedDB)
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

            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <p>
                Clearing your browser data will delete all CreatorFlow data
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
