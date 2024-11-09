import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  roleDescription: string;
  createdAt: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  isOnline: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  toggleOnline: () => void;
  clearError: () => void;
  updateProfile: (data: { firstName: string; lastName: string; profileImage?: string }) => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isOnline: true,
  error: null,

  clearError: () => set({ error: null }),

  login: async ({ email, password }) => {
    try {
      set({ error: null });
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });
      
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user });

      toast.success(`¡Bienvenido, ${user.firstName}!`, {
        icon: '👋',
        position: 'top-center',
        duration: 3000
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Error al iniciar sesión';
        set({ error: message });
        throw new Error(message);
      }
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ error: null });
      await axios.post('http://localhost:3000/api/auth/register', userData);
      toast.success('Usuario registrado exitosamente');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Error al registrar usuario';
        set({ error: message });
        throw new Error(message);
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },

  toggleOnline: () => set((state) => ({ isOnline: !state.isOnline })),

  updateProfile: async (data) => {
    const currentUser = get().user;
    if (!currentUser) return;

    try {
      const response = await axios.put(`http://localhost:3000/api/auth/profile/${currentUser.id}`, data);
      
      set((state) => ({
        user: state.user ? { 
          ...state.user, 
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          profileImage: response.data.user.profileImage
        } : null
      }));

      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      throw error;
    }
  }
}));