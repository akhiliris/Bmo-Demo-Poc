import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeType = 'strategy' | 'risk' | 'auth';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly value = input.required<string>();
  readonly type = input.required<BadgeType>();

  readonly badgeClass = computed(() => {
    const v = this.value()?.toLowerCase() ?? '';
    switch (this.type()) {
      case 'strategy':
        return {
          'badge-api':      v === 'api',
          'badge-rag':      v === 'rag',
          'badge-hybrid':   v === 'hybrid',
          'badge-escalate': v === 'escalate',
        };
      case 'risk':
        return {
          'badge-risk-low':    v === 'low',
          'badge-risk-medium': v === 'medium',
          'badge-risk-high':   v === 'high',
        };
      case 'auth':
        return {
          'badge-auth-none':          v === 'none',
          'badge-auth-authenticated': v === 'authenticated',
          'badge-auth-step-up':       v === 'step_up',
        };
      default:
        return {};
    }
  });
}
