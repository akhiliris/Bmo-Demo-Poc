import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  readonly isCollapsed = signal(false);
  toggle(): void { this.isCollapsed.update(v => !v); }
}
