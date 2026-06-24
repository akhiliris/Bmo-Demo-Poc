import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IntentService } from '../../core/services/intent.service';
import { Intent, Strategy, RiskLevel, AuthType } from '../../core/models/intent.model';
import { IntentDetailPanelComponent } from './intent-detail-panel.component';

interface FilterState {
  domain: string;
  risk: string;
  authentication: string;
  strategy: string;
  status: string;
}

const EMPTY_FILTERS: FilterState = { domain: '', risk: '', authentication: '', strategy: '', status: '' };

@Component({
  selector: 'app-intents',
  standalone: true,
  imports: [CommonModule, FormsModule, IntentDetailPanelComponent],
  templateUrl: './intents.component.html',
  styleUrl: './intents.component.scss',
})
export class IntentsComponent {
  readonly intentService = inject(IntentService);
  readonly selectedIntent = signal<Intent | null>(null);

  readonly searchQuery = signal('');
  readonly pageSize = signal(10);
  private _currentPage = signal(1);
  readonly currentPage = this._currentPage.asReadonly();

  readonly filtersOpen = signal(false);
  pendingFilters: FilterState = { ...EMPTY_FILTERS };
  private readonly _appliedFilters = signal<FilterState>({ ...EMPTY_FILTERS });

  readonly domainOptions = computed(() =>
    [...new Set(this.intentService.intents().map(i => i.domain))].sort()
  );

  readonly activeFilterCount = computed(() => {
    const f = this._appliedFilters();
    return [f.domain, f.risk, f.authentication, f.strategy, f.status].filter(v => v !== '').length;
  });

  readonly filteredIntents = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const f = this._appliedFilters();
    return this.intentService.intents().filter(i => {
      if (q && !(
        i.name.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.domain.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      )) return false;
      if (f.domain && i.domain !== f.domain) return false;
      if (f.risk && i.risk !== f.risk) return false;
      if (f.authentication && i.authentication !== f.authentication) return false;
      if (f.strategy && i.strategy !== f.strategy) return false;
      if (f.status && i.status !== f.status) return false;
      return true;
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredIntents().length / this.pageSize()))
  );

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  readonly pageStart = computed(() =>
    this.filteredIntents().length === 0 ? 0 : (this._currentPage() - 1) * this.pageSize() + 1
  );

  readonly pageEnd = computed(() =>
    Math.min(this._currentPage() * this.pageSize(), this.filteredIntents().length)
  );

  readonly pagedIntents = computed(() => {
    const start = (this._currentPage() - 1) * this.pageSize();
    return this.filteredIntents().slice(start, start + this.pageSize());
  });

  toggleFilters(): void {
    const opening = !this.filtersOpen();
    this.filtersOpen.set(opening);
    if (opening) this.pendingFilters = { ...this._appliedFilters() };
  }

  applyFilters(): void {
    this._appliedFilters.set({ ...this.pendingFilters });
    this._currentPage.set(1);
    this.filtersOpen.set(false);
  }

  resetFilters(): void {
    this.pendingFilters = { ...EMPTY_FILTERS };
    this._appliedFilters.set({ ...EMPTY_FILTERS });
    this._currentPage.set(1);
    this.filtersOpen.set(false);
  }

  onSearch(): void { this._currentPage.set(1); }
  onPageSizeChange(): void { this._currentPage.set(1); }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) this._currentPage.set(page);
  }

  prevPage(): void { this.goToPage(this._currentPage() - 1); }
  nextPage(): void { this.goToPage(this._currentPage() + 1); }

  onRowClick(intent: Intent): void { this.selectedIntent.set(intent); }

  onDeleteExample(example: string): void {
    const intent = this.selectedIntent();
    if (!intent) return;
    const updated = { ...intent, trainingExamples: (intent.trainingExamples ?? []).filter(e => e !== example) };
    this.intentService.updateIntent(updated);
    this.selectedIntent.set(updated);
  }

  onAddExample(example: string): void {
    const intent = this.selectedIntent();
    if (!intent) return;
    const updated = { ...intent, trainingExamples: [...(intent.trainingExamples ?? []), example] };
    this.intentService.updateIntent(updated);
    this.selectedIntent.set(updated);
  }

  onEdit(event: Event, intent: Intent): void {
    event.stopPropagation();
    console.log('Edit:', intent);
  }

  onDelete(event: Event, intent: Intent): void {
    event.stopPropagation();
    if (confirm(`Delete "${intent.name}"?`)) this.intentService.deleteIntent(intent.id);
  }

  onMore(event: Event, intent: Intent): void {
    event.stopPropagation();
    console.log('More:', intent);
  }

  onReloadRegistry(): void { this.intentService.loadIntents(); }
  onFullRefresh(): void { console.log('Full Refresh'); }
  onNewIntent(): void { console.log('New Intent'); }

  onExportCsv(): void {
    const headers = ['Name', 'Code', 'Domain', 'Category', 'Strategy', 'Risk', 'Authentication', 'Status'];
    const rows = this.intentService.intents().map(i =>
      [i.name, i.code, i.domain, i.category, i.strategy, i.risk, i.authentication, i.status].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'intents.csv';
    a.click();
    URL.revokeObjectURL(url);
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
