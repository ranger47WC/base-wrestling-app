// Mock auth service — will be replaced with Firebase
export interface MockUser {
  uid: string;
  email: string;
  role: 'coach' | 'athlete' | 'parent';
}

let currentUser: MockUser | null = null;

export const mockAuth = {
  login: async (email: string, _password: string): Promise<MockUser> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!email.includes('@')) {
      throw new Error('Invalid email address');
    }

    currentUser = {
      uid: 'mock-coach-001',
      email,
      role: 'coach',
    };

    return currentUser;
  },

  getCurrentUser: (): MockUser | null => currentUser,

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    currentUser = null;
  },
};
