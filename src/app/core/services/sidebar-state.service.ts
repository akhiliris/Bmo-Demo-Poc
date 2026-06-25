import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  readonly isCollapsed = signal(true);
  toggle(): void { this.isCollapsed.update(v => !v); }
}
