import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppNavbar } from '@/components/AppNavbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockAPI } from '@/services/mockAPI';
import { Project } from '@/services/storageManager';
import { Plus, Video, Clock, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalExports: 0,
    thisMonth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, analytics] = await Promise.all([
        mockAPI.getProjects(),
        mockAPI.getAnalytics(),
      ]);
      
      setProjects(projectsData);
      setStats({
        totalVideos: projectsData.length,
        totalExports: analytics.totalExports || 0,
        thisMonth: projectsData.filter(p => {
          const projectDate = new Date(p.createdAt);
          const now = new Date();
          return projectDate.getMonth() === now.getMonth() && 
                 projectDate.getFullYear() === now.getFullYear();
        }).length,
      });
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await mockAPI.deleteProject(projectId);
      toast.success('Project deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="container py-12">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      <div className="container py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Projects</h1>
            <p className="text-muted-foreground">Create and manage your video projects</p>
          </div>
          <Link to="/editor">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Videos</p>
                <p className="text-2xl font-bold">{stats.totalVideos}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Edit className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Exports</p>
                <p className="text-2xl font-bold">{stats.totalExports}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first video project to get started
            </p>
            <Link to="/editor">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <Video className="h-12 w-12 text-primary/50" />
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {project.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{formatDate(project.createdAt)}</span>
                    <span>{formatDuration(project.duration || 0)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`/editor?project=${project.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
