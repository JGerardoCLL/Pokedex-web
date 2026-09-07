import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly storageKey = 'pokemon-favorites';

  getIds(): number[] {
    const storedFavorites = localStorage.getItem(this.storageKey);

    if (!storedFavorites) {
      return [];
    }

    try {
      return JSON.parse(storedFavorites) as number[];
    } catch {
      return [];
    }
  }

  isFavorite(id: number): boolean {
    return this.getIds().includes(id);
  }

  toggle(id: number): void {
    const ids = this.getIds();

    const updatedIds = ids.includes(id)
      ? ids.filter((favoriteId) => favoriteId !== id)
      : [...ids, id];

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(updatedIds)
    );
  }

  remove(id: number): void {
    const updatedIds = this.getIds().filter(
      (favoriteId) => favoriteId !== id
    );
 //guardar los ids
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(updatedIds)
    );
  }
}