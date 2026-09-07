import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private readonly storageKey = 'pokedex-current-page';

  getPage(): number {
    return Number(sessionStorage.getItem(this.storageKey)) || 1;
  }

  setPage(page: number): void {
    sessionStorage.setItem(this.storageKey, page.toString());
  }

  resetPage(): void {
    this.setPage(1);
  }
}
