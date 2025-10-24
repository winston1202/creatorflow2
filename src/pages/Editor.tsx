import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppNavbar } from '@/components/AppNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAPI } from '@/services/mockAPI';
import { Project } from '@/services/storageManager';
import {
  Save,
  Download,
  Upload,
  Scissors,
  Type,
  Music,
  Sparkles,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Editor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');

  const [project, setProject] = useState<Project>({
    id: projectId || `proj_${Date.now()}`,
    title: 'Untitled Project',
    description: '',
    duration: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {},
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [aiScript, setAiScript] = useState('');
  const [scriptPrompt, setScriptPrompt] = useState('');

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    try {
      const loadedProject = await mockAPI.getProject(id);
      if (loadedProject) {
        setProject(loadedProject);
      }
    } catch (error) {
      toast.error('Failed to load project');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await mockAPI.saveProject(project);
      toast.success('Project saved');
    } catch (error) {
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await mockAPI.exportVideo(project.id);
      toast.success('Video exported successfully!');
      // In real app, would trigger download
      console.log('Export URL:', result.url);
    } catch (error) {
      toast.error('Failed to export video');
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!scriptPrompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    try {
      toast.loading('Generating script...', { id: 'ai-script' });
      const script = await mockAPI.generateScript(scriptPrompt);
      setAiScript(script);
      toast.success('Script generated!', { id: 'ai-script' });
    } catch (error) {
      toast.error('Failed to generate script', { id: 'ai-script' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <div className="container py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex-1">
            <Input
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0"
              placeholder="Project Title"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <Card className="p-4">
              <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center rounded-lg mb-4">
                <Play className="h-16 w-16 text-muted-foreground" />
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="icon">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                <Button variant="ghost" size="icon">
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {/* Timeline */}
              <div className="mt-6">
                <div className="h-24 bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-sm text-muted-foreground">
                  Timeline tracks will appear here
                </div>
              </div>
            </Card>

            {/* Tools */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Upload</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Scissors className="h-6 w-6" />
                  <span className="text-xs">Trim</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Type className="h-6 w-6" />
                  <span className="text-xs">Text</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Music className="h-6 w-6" />
                  <span className="text-xs">Audio</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <Card className="p-4">
              <Tabs defaultValue="ai" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ai">AI Tools</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="assets">Assets</TabsTrigger>
                </TabsList>

                <TabsContent value="ai" className="space-y-4">
                  <div>
                    <Label htmlFor="script-prompt">AI Script Generator</Label>
                    <Input
                      id="script-prompt"
                      placeholder="Describe your video idea..."
                      value={scriptPrompt}
                      onChange={(e) => setScriptPrompt(e.target.value)}
                      className="mt-2 mb-2"
                    />
                    <Button onClick={handleGenerateScript} className="w-full gap-2" size="sm">
                      <Sparkles className="h-4 w-4" />
                      Generate Script
                    </Button>
                  </div>

                  {aiScript && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <Label className="text-xs text-muted-foreground">Generated Script:</Label>
                      <p className="text-sm mt-2 whitespace-pre-wrap">{aiScript}</p>
                    </div>
                  )}

                  <div className="space-y-2 pt-4 border-t">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Voiceover
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Auto Captions
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Smart Edit
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="templates" className="space-y-3">
                  <div className="space-y-2">
                    <div className="aspect-video bg-muted rounded-lg" />
                    <p className="text-sm font-medium">Story Video</p>
                  </div>
                  <div className="space-y-2">
                    <div className="aspect-video bg-muted rounded-lg" />
                    <p className="text-sm font-medium">Product Review</p>
                  </div>
                  <div className="space-y-2">
                    <div className="aspect-video bg-muted rounded-lg" />
                    <p className="text-sm font-medium">Tutorial</p>
                  </div>
                </TabsContent>

                <TabsContent value="assets" className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Media
                  </Button>
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Your media library will appear here
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Project Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Input
                    value={project.description}
                    onChange={(e) => setProject({ ...project, description: e.target.value })}
                    placeholder="Add description..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Duration</Label>
                  <p className="mt-1">{project.duration || 0}s</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Created</Label>
                  <p className="mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
