// Mock API service that simulates backend calls
// Can be easily replaced with real API endpoints later

import { storage, User, Project, Review } from './storageManager';

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate occasional errors (1% chance)
const simulateError = () => {
  if (Math.random() < 0.01) {
    throw new Error('Network error - please try again');
  }
};

export const mockAPI = {
  // Authentication endpoints
  async login(email: string, password: string): Promise<User | null> {
    await delay();
    simulateError();
    return storage.login(email, password);
  },

  async signup(username: string, email: string, password: string): Promise<User> {
    await delay();
    simulateError();
    return storage.createUser(username, email, password);
  },

  async logout(): Promise<void> {
    await delay();
    storage.logout();
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    // Check if user has an active session
    if (!storage.isLoggedIn()) {
      return null;
    }
    return storage.getUser();
  },

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    await delay();
    simulateError();
    return storage.getProjects();
  },

  async getProject(id: string): Promise<Project | null> {
    await delay();
    return storage.getProject(id);
  },

  async saveProject(project: Project): Promise<Project> {
    await delay();
    simulateError();
    storage.saveProject(project);
    return project;
  },

  async deleteProject(id: string): Promise<void> {
    await delay();
    storage.deleteProject(id);
  },

  async exportVideo(projectId: string): Promise<{ url: string }> {
    await delay(2000); // Simulate longer export time
    simulateError();
    // In real app, this would process and upload the video
    return {
      url: `blob:export_${projectId}_${Date.now()}.mp4`,
    };
  },

  // Review endpoints
  async getReviews(): Promise<Review[]> {
    await delay();
    return storage.getReviews();
  },

  async submitReview(review: Omit<Review, 'id'>): Promise<Review> {
    await delay();
    simulateError();
    storage.addReview(review);
    return { ...review, id: `rev_${Date.now()}` };
  },

  // Analytics endpoints
  async getAnalytics(): Promise<any> {
    await delay();
    return storage.getAnalytics();
  },

  async updateAnalytics(data: any): Promise<void> {
    await delay();
    Object.keys(data).forEach(key => {
      storage.updateAnalytics(key, data[key]);
    });
  },

  // Template endpoints
  async getTemplates(): Promise<any[]> {
    await delay();
    // Return mock templates
    return [
      {
        id: 'template1',
        title: 'Story Video',
        description: 'Perfect for narrative content',
        thumbnail: 'https://images.pexels.com/photos/3855962/pexels-photo-3855962.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Story',
      },
      {
        id: 'template2',
        title: 'Product Review',
        description: 'Showcase products effectively',
        thumbnail: 'https://images.pexels.com/photos/6214474/pexels-photo-6214474.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Review',
      },
      {
        id: 'template3',
        title: 'Tutorial',
        description: 'Educational content format',
        thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Tutorial',
      },
    ];
  },

  // AI endpoints
  async generateScript(description: string): Promise<string> {
    await delay(1500);
    simulateError();
    // Simulate AI script generation
    return `[Opening Hook]\nHey everyone! Let me show you something amazing...\n\n[Main Content]\n${description}\n\n[Call to Action]\nDon't forget to like and subscribe for more!`;
  },

  async generateVoiceover(text: string, voice: string): Promise<{ url: string }> {
    await delay(2000);
    simulateError();
    // Simulate voiceover generation
    return {
      url: `blob:voiceover_${Date.now()}.mp3`,
    };
  },

  // Stats endpoints (for global platform stats)
  async getGlobalStats(): Promise<any> {
    await delay();
    const baseStats = {
      totalCreators: 1024,
      totalVideos: 15623,
      totalViews: 2456789,
      avgRating: 4.8,
    };
    
    // Add slight variations to make it feel dynamic
    const variation = Math.floor(Math.random() * 10);
    return {
      ...baseStats,
      totalCreators: baseStats.totalCreators + variation,
      totalVideos: baseStats.totalVideos + variation * 2,
    };
  },
};

// TODO: Replace with real API endpoints when backend is ready
// Example migration path:
// export const api = {
//   async login(email, password) {
//     const res = await fetch('/api/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password })
//     });
//     return res.json();
//   },
//   ... etc
// }
