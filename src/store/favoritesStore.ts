// favoritesStore.ts
import {create} from 'zustand';
import { toggleFavorite as apiToggleFavorite, isFavoriteBeamsToday } from '@/actions/beams-today/favoriteActions';

interface FavoritesState {
  favorites: Set<string>;
  isInitialized: boolean;
  toggleFavorite: (id: string) => Promise<void>;
  initializeFavorites: () => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: new Set<string>(),
  isInitialized: false,

  toggleFavorite: async (id: string) => {
    const { favorites } = get();
    const newFavorites = new Set(favorites);

    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }

    set({ favorites: newFavorites });

    // Call the API to update the server
    await apiToggleFavorite(id);
  },

  initializeFavorites: async () => {
    if (get().isInitialized) return;

    // This is a placeholder. You'll need to implement a way to get all relevant IDs
    const allBeamsTodayIds:any = [/* fetch or provide all relevant IDs */];
    const favoritesSet = new Set<string>();
    
    for (const id of allBeamsTodayIds) {
      if (await isFavoriteBeamsToday(id)) {
        favoritesSet.add(id);
      }
    }
    
    set({ favorites: favoritesSet, isInitialized: true });
  },

  isFavorite: (id: string) => {
    return get().favorites.has(id);
  },
}));