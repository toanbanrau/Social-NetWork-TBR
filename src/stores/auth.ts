import type { IUser } from '@/types/user.type';
import { atomWithStorage } from 'jotai/utils';

export interface AuthState {
  user: IUser | null;
  token: string | null;
}

export const atomAuth = atomWithStorage<AuthState>('auth', {
  user: null,
  token: null,
});

export const clearAuth = () => {
  localStorage.removeItem('auth');
};