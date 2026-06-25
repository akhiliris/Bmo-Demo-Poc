import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="ui-spinner" xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size()" [attr.height]="size()"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; }
    .ui-spinner { animation: spin 0.9s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `],
})
export class SpinnerComponent {
  readonly size = input(18);
}
