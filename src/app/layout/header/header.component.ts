import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <!-- Left: Menu toggle + Page title -->
      <div class="header-left">
        <button class="menu-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="7" height="7" x="3" y="3" rx="1"/>
            <rect width="7" height="7" x="14" y="3" rx="1"/>
            <rect width="7" height="7" x="14" y="14" rx="1"/>
            <rect width="7" height="7" x="3" y="14" rx="1"/>
          </svg>
        </button>
        <span class="page-label">Intents</span>
      </div>

      <!-- Center: BMO Logo -->
      <div class="header-center">
        <div class="bmo-logo">BMO</div>
      </div>

      <!-- Right: Search + User -->
      <div class="header-right">
        <div class="search-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input class="search-input" placeholder="Find a customer" type="search" />
        </div>
        <div class="user-badge">
          <div class="user-avatar">AD</div>
          <div class="user-info">
            <span class="user-name">admin</span>
            <span class="user-role">Admin</span>
          </div>
        </div>
        <button class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: 64px;
      background: rgb(0, 121, 193);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      flex-shrink: 0;
      position: relative;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .menu-btn {
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.85);
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.15s;

      &:hover {
        background: rgba(255,255,255,0.15);
      }
    }

    .page-label {
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
    }

    .header-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .bmo-logo {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgb(237, 28, 36);
      color: #ffffff;
      font-weight: 700;
      font-size: 13px;
      font-family: 'Heebo', sans-serif;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .search-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 10px;
      color: #9ca3af;
    }

    .search-input {
      width: 220px;
      padding: 7px 12px 7px 32px;
      font-size: 13px;
      font-family: inherit;
      background: #ffffff;
      border: 1px solid #e4e8ee;
      border-radius: 6px;
      outline: none;
      color: #374151;

      &::placeholder {
        color: #9ca3af;
      }
    }

    .user-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgb(0, 80, 150);
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(255,255,255,0.3);
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 500;
      color: #ffffff;
      line-height: 1.2;
    }

    .user-role {
      font-size: 11px;
      color: rgba(255,255,255,0.7);
    }

    .close-btn {
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.15s;

      &:hover {
        background: rgba(255,255,255,0.15);
        color: #ffffff;
      }
    }
  `]
})
export class HeaderComponent {}
