import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViewerSearchService {
  private search$ = new BehaviorSubject<string>('');

  set(query: string) {
    this.search$.next(query || '');
  }

  changes() {
    return this.search$.asObservable();
  }

  value() {
    return this.search$.value;
  }
}
