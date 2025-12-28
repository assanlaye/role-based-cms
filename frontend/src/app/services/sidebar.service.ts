import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarOpenSubject = new BehaviorSubject<boolean>(true);
  public sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  constructor() { }

  toggleSidebar() {
    const currentState = this.sidebarOpenSubject.value;
    this.sidebarOpenSubject.next(!currentState);
  }

  setSidebarState(open: boolean) {
    this.sidebarOpenSubject.next(open);
  }

  getSidebarState(): boolean {
    return this.sidebarOpenSubject.value;
  }
}
