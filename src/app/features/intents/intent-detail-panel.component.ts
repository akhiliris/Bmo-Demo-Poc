import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Intent } from '../../core/models/intent.model';

@Component({
  selector: 'app-intent-detail-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intent-detail-panel.component.html',
  styleUrl: './intent-detail-panel.component.scss',
})
export class IntentDetailPanelComponent {
  readonly intent = input.required<Intent>();
  readonly close = output<void>();
  readonly deleteExample = output<string>();
  readonly addExample = output<string>();

  readonly examplesOpen = signal(true);
  readonly addingExample = signal(false);
  newExampleText = '';

  submitExample(): void {
    const text = this.newExampleText.trim();
    if (text) this.addExample.emit(text);
    this.newExampleText = '';
    this.addingExample.set(false);
  }

  cancelAddExample(): void {
    this.newExampleText = '';
    this.addingExample.set(false);
  }

  getStrategyClass(strategy: string): string {
    const map: Record<string, string> = {
      API: 'badge-api', RAG: 'badge-rag', HYBRID: 'badge-hybrid', ESCALATE: 'badge-escalate',
    };
    return map[strategy] ?? '';
  }

  getRiskClass(risk: string): string {
    const map: Record<string, string> = {
      LOW: 'badge-risk-low', MEDIUM: 'badge-risk-medium', HIGH: 'badge-risk-high',
    };
    return map[risk] ?? '';
  }

  getAuthClass(auth: string): string {
    const map: Record<string, string> = {
      AUTHENTICATED: 'badge-auth-authenticated', STEP_UP: 'badge-auth-step-up', NONE: 'badge-auth-none',
    };
    return map[auth] ?? '';
  }
}
