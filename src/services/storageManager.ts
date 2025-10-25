// Local-first storage manager for all app data
// Can be easily upgraded to sync with backend later

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'professional' | 'creator';
  createdAt: string;
  preferences: {
    theme: string;
    autosave: boolean;
    notifications: boolean;
  };
}

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  data: any; // Video project data
}

interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

class StorageManager {
  // User Management
  getUser(): User | null {
    const userData = localStorage.getItem('creatorflow_user');
    return userData ? JSON.parse(userData) : null;
  }

  saveUser(user: User): void {
    localStorage.setItem('creatorflow_user', JSON.stringify(user));
  }

  createUser(username: string, email: string, password: string): User {
    const user: User = {
      id: `user_${Date.now()}`,
      username,
      email,
      plan: 'free',
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'blue',
        autosave: true,
        notifications: true,
      },
    };
    this.saveUser(user);
    // Store password hash (in real app, this would be on backend)
    localStorage.setItem('creatorflow_auth', btoa(email + ':' + password));
    // Create active session
    localStorage.setItem('creatorflow_session', 'active');
    return user;
  }

  login(email: string, password: string): User | null {
    // Demo account always works
    if (email === 'demo@creatorflow.com' && password === 'demo123') {
      const demoUser: User = {
        id: 'demo_user',
        username: 'DemoCreator',
        email: 'demo@creatorflow.com',
        plan: 'professional',
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'blue',
          autosave: true,
          notifications: true,
        },
      };
      this.saveUser(demoUser);
      localStorage.setItem('creatorflow_session', 'active');
      return demoUser;
    }

    const storedAuth = localStorage.getItem('creatorflow_auth');
    const attemptAuth = btoa(email + ':' + password);
    
    if (storedAuth === attemptAuth) {
      // Create active session
      localStorage.setItem('creatorflow_session', 'active');
      return this.getUser();
    }
    return null;
  }

  logout(): void {
    // Clear session but keep projects and user data for re-login
    localStorage.removeItem('creatorflow_session');
    sessionStorage.clear();
  }

  isLoggedIn(): boolean {
    // Check if there's an active session
    return localStorage.getItem('creatorflow_session') === 'active' && this.getUser() !== null;
  }

  // Project Management
  getProjects(): Project[] {
    const projects = localStorage.getItem('creatorflow_projects');
    return projects ? JSON.parse(projects) : [];
  }

  saveProject(project: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index >= 0) {
      projects[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.push(project);
    }
    
    localStorage.setItem('creatorflow_projects', JSON.stringify(projects));
  }

  deleteProject(projectId: string): void {
    const projects = this.getProjects().filter(p => p.id !== projectId);
    localStorage.setItem('creatorflow_projects', JSON.stringify(projects));
  }

  getProject(projectId: string): Project | null {
    return this.getProjects().find(p => p.id === projectId) || null;
  }

  // Reviews Management
  getReviews(): Review[] {
    const reviews = localStorage.getItem('creatorflow_reviews');
    if (reviews) return JSON.parse(reviews);
    
    // Initialize with mock reviews
    const mockReviews: Review[] = [
      {
        id: 'rev1',
        username: 'Sarah Chen',
        rating: 5,
        comment: 'CreatorFlow transformed my content strategy. The AI tools are incredible!',
        date: '2025-10-15',
        verified: true,
      },
      {
        id: 'rev2',
        username: 'Marcus Rivera',
        rating: 5,
        comment: 'Best video editing platform for creators. Made my first viral video in 20 minutes.',
        date: '2025-10-10',
        verified: true,
      },
      {
        id: 'rev3',
        username: 'Emma Thompson',
        rating: 4,
        comment: 'Love the template library and how easy it is to customize everything.',
        date: '2025-10-08',
        verified: true,
      },
    ];
    
    localStorage.setItem('creatorflow_reviews', JSON.stringify(mockReviews));
    return mockReviews;
  }

  addReview(review: Omit<Review, 'id'>): void {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
    };
    reviews.unshift(newReview);
    localStorage.setItem('creatorflow_reviews', JSON.stringify(reviews));
  }

  // Analytics
  getAnalytics() {
    const analytics = localStorage.getItem('creatorflow_analytics');
    if (analytics) return JSON.parse(analytics);
    
    // Initialize with mock data
    const mockAnalytics = {
      totalVideos: 0,
      totalExports: 0,
      totalViews: 0,
      avgEngagement: 0,
      videosByMonth: Array(6).fill(0),
    };
    
    localStorage.setItem('creatorflow_analytics', JSON.stringify(mockAnalytics));
    return mockAnalytics;
  }

  updateAnalytics(field: string, value: number): void {
    const analytics = this.getAnalytics();
    analytics[field] = value;
    localStorage.setItem('creatorflow_analytics', JSON.stringify(analytics));
  }

  // Clear all data (for testing or reset)
  clearAllData(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
}

export const storage = new StorageManager();
export type { User, Project, Review };
