import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-shell">
      <app-header />
      <div class="app-body">
        <app-sidebar />
        <div class="main-content">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }

    .app-shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .app-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      background: rgb(247, 248, 250);
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * When a browser tab becomes visible after being hidden, Chrome re-composites
   * GPU layers and can replay CSS transitions (sidebar width, chevrons, etc.),
   * causing a visible "flash" or layout jump.
   *
   * Fix: add `no-transitions` to <html> for exactly 2 animation frames after
   * the tab is restored. The CSS rule `html.no-transitions * { transition: 0s }`
   * suppresses all transitions during that window, then they re-enable cleanly.
   */
  private readonly _onVisibilityChange = (): void => {
    if (!document.hidden) {
      document.documentElement.classList.add('no-transitions');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.documentElement.classList.remove('no-transitions');
        });
      });
    }
  };

  ngOnInit(): void {
    document.addEventListener('visibilitychange', this._onVisibilityChange);
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
  }
}
