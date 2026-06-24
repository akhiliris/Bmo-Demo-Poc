import { Component, input, output, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Intent, Strategy, RiskLevel, AuthType } from '../../../../core/models/intent.model';

@Component({
  selector: 'app-intents-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intents-table.component.html',
  styleUrl: './intents-table.component.scss',
})
export class IntentsTableComponent {
  readonly intents = input<Intent[]>([]);
  readonly currentPage = input(1);
  readonly totalPages = input(1);
  readonly pageNumbers = input<number[]>([1]);
  readonly pageSize = input(10);
  readonly pageStart = input(0);
  readonly pageEnd = input(0);
  readonly totalCount = input(0);
  readonly loading = input(false);
  readonly error = input<string | null>(null);

  readonly rowClick = output<Intent>();
  readonly editClick = output<Intent>();
  readonly deleteClick = output<Intent>();
  readonly viewDetails = output<Intent>();
  readonly toggleStatus = output<Intent>();
  readonly duplicateIntent = output<Intent>();
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly activeMoreMenuId = signal<string | null>(null);

  @HostListener('document:click')
  closeMenus(): void {
    this.activeMoreMenuId.set(null);
  }

  onMore(event: Event, intent: Intent): void {
    event.stopPropagation();
    const current = this.activeMoreMenuId();
    this.activeMoreMenuId.set(current === intent.id ? null : intent.id);
  }

  onMenuSelect(event: Event, action: string, intent: Intent): void {
    event.stopPropagation();
    this.activeMoreMenuId.set(null);
    if (action === 'view') this.viewDetails.emit(intent);
    else if (action === 'duplicate') this.duplicateIntent.emit(intent);
    else if (action === 'usage') { /* View Usage — placeholder */ }
    else if (action === 'export') { /* Export — placeholder */ }
  }

  onPageSizeSelect(value: string): void {
    this.pageSizeChange.emit(+value);
  }

  getStrategyClass(strategy: Strategy): string {
    const map: Record<Strategy, string> = {
      API: 'badge-api', RAG: 'badge-rag', HYBRID: 'badge-hybrid', ESCALATE: 'badge-escalate',
    };
    return map[strategy] ?? '';
  }

  getRiskClass(risk: RiskLevel): string {
    const map: Record<RiskLevel, string> = {
      LOW: 'badge-risk-low', MEDIUM: 'badge-risk-medium', HIGH: 'badge-risk-high',
    };
    return map[risk] ?? '';
  }

  getAuthClass(auth: AuthType): string {
    const map: Record<AuthType, string> = {
      AUTHENTICATED: 'badge-auth-authenticated', STEP_UP: 'badge-auth-step-up', NONE: 'badge-auth-none',
    };
    return map[auth] ?? '';
  }
}
