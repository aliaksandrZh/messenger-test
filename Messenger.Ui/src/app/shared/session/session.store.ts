import { Service, computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';

const STORAGE_KEY = 'messenger.currentUserId';

// Best-effort localStorage access — it can be unavailable (private mode) or
// throw on quota. Persistence failures must not break the in-memory session.
const readUserId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeUserId = (id: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* best-effort */
  }
};

const clearUserId = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* best-effort */
  }
};

interface SessionState {
  currentUserId: string | null;
}

@Service()
export class SessionStore extends signalStore(
  withState<SessionState>({ currentUserId: readUserId() }),
  withComputed(({ currentUserId }) => ({
    isLoggedIn: computed(() => currentUserId() !== null),
  })),
  withMethods((store) => ({
    setCurrentUser(id: string): void {
      patchState(store, { currentUserId: id });
      writeUserId(id);
    },
    clearCurrentUser(): void {
      patchState(store, { currentUserId: null });
      clearUserId();
    },
  })),
) {}