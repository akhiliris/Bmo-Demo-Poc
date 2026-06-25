import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarStateService } from '../../core/services/sidebar-state.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly sidebarState = inject(SidebarStateService);

  sections = [
    { expanded: true },   // Convo Banking
    { expanded: false },  // AI Configuration
    { expanded: false },  // System Configuration
    { expanded: false },  // Monitoring
  ];

  toggleSection(index: number): void {
    this.sections[index].expanded = !this.sections[index].expanded;
  }
}
