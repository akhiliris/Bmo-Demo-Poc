import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly btnClass = computed(() =>
    ['ui-btn', `ui-btn--${this.variant()}`, `ui-btn--${this.size()}`].join(' ')
  );

  readonly spinSize = computed(() =>
    ({ sm: 11, md: 13, lg: 15 }[this.size()] ?? 13)
  );
}
