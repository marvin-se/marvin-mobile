import { create } from 'zustand';
import { User } from '@/types/auth';
import { getToken, removeToken } from '@/utils/storage';
import { authService } from '@/api/services/auth';

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    setUser: (user: User) => void;
    clearUser: () => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    setUser: (user: User) => {
        set({ user, isAuthenticated: true });
    },

    clearUser: () => {
        set({ user: null, isAuthenticated: false });
    },

    logout: async () => {
        try {
            await authService.logout();
        } catch (error) {
            // Logout API hatası olsa bile local'i temizle
        } finally {
            await removeToken();
            set({ user: null, isAuthenticated: false });
        }
    },

    checkAuth: async () => {
        const token = await getToken();
        if (token) {
            try {
                const user = await authService.getCurrentUser();
                set({ user, isAuthenticated: true });
                return true;
            } catch (error) {
                await removeToken();
                set({ user: null, isAuthenticated: false });
                return false;
            }
        }
        set({ isAuthenticated: false });
        return false;
    },
}));