import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntentService } from '../../core/services/intent.service';
import { Intent } from '../../core/models/intent.model';
import { IntentDetailPanelComponent } from './intent-detail-panel.component';
import { IntentsStatsComponent } from './components/stats-cards/stats-cards.component';
import { IntentsToolbarComponent } from './components/intents-toolbar/intents-toolbar.component';
import { IntentsTableComponent } from './components/intents-table/intents-table.component';
import { IntentModalComponent } from './components/intent-modal/intent-modal.component';
import { FilterState, EMPTY_FILTERS, IntentFormData } from './intents.types';
import { ButtonComponent } from '../../shared/components/ui';

@Component({
  selector: 'app-intents',
  standalone: true,
  imports: [
    CommonModule,
    IntentDetailPanelComponent,
    IntentsStatsComponent,
    IntentsToolbarComponent,
    IntentsTableComponent,
    IntentModalComponent,
    ButtonComponent,
  ],
  templateUrl: './intents.component.html',
  styleUrl: './intents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntentsComponent {
  readonly intentService = inject(IntentService);

  // ---- Detail panel ----
  readonly selectedIntent = signal<Intent | null>(null);

  // ---- Search / Filter / Pagination ----
  readonly searchQuery = signal('');
  readonly pageSize = signal(10);
  private readonly _currentPage = signal(1);
  readonly currentPage = this._currentPage.asReadonly();

  private readonly _appliedFilters = signal<FilterState>({ ...EMPTY_FILTERS });
  readonly appliedFilters = this._appliedFilters.asReadonly();

  // ---- Edit Modal ----
  readonly editModalIntent = signal<Intent | null>(null);
  readonly editLoading = signal(false);

  // ---- New Intent Modal ----
  readonly newModalOpen = signal(false);
  readonly newModalLoading = signal(false);

  // ---- Save error (shown when API call fails) ----
  readonly saveError = signal<string | null>(null);

  // ---- Computed ----
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

  // ---- Toolbar events ----
  onSearchChange(q: string): void {
    this.searchQuery.set(q);
    this._currentPage.set(1);
  }

  onFilterApply(filters: FilterState): void {
    this._appliedFilters.set(filters);
    this._currentPage.set(1);
  }

  onFilterReset(): void {
    this._appliedFilters.set({ ...EMPTY_FILTERS });
    this._currentPage.set(1);
  }

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

  // ---- Table events ----
  onRowClick(intent: Intent): void { this.selectedIntent.set(intent); }

  onEditClick(intent: Intent): void {
    this.editLoading.set(true);
    this.editModalIntent.set(intent);

    this.intentService.loadIntentDetail(intent.code).subscribe({
      next: (detail) => {
        this.editModalIntent.set(detail);
        this.editLoading.set(false);
      },
      error: () => {
        this.editLoading.set(false);
      },
    });
  }

  onDeleteClick(intent: Intent): void {
    if (confirm(`Delete "${intent.name}"?`)) {
      this.intentService.deleteIntent(intent.id);
    }
  }

  onViewDetails(intent: Intent): void { this.selectedIntent.set(intent); }

  onDuplicateIntent(intent: Intent): void {
    const copy: Intent = {
      ...intent,
      id: crypto.randomUUID(),
      name: intent.name + ' (Copy)',
      code: intent.code + '_COPY',
    };
    this.intentService.addIntent(copy);
  }

  onToggleStatus(intent: Intent): void {
    const updated: Intent = { ...intent, status: intent.status === 'Active' ? 'Inactive' : 'Active' };
    this.intentService.updateIntent(updated);
    if (this.selectedIntent()?.id === intent.id) this.selectedIntent.set(updated);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) this._currentPage.set(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this._currentPage.set(1);
  }

  // ---- Edit modal events ----
  onEditSave(formData: IntentFormData): void {
    const intent = this.editModalIntent();
    if (!intent) return;
    const updated: Intent = {
      ...intent,
      name: formData.name,
      description: formData.description,
      strategy: formData.strategy,
      risk: formData.risk,
      authentication: formData.authentication,
      status: formData.status,
      releasePhase: formData.releasePhase,
      trainingExamples: formData.trainingExamples,
      channels: formData.channels,
      apiCapabilities: formData.capabilityTags,
    };
    this.editLoading.set(true);
    this.saveError.set(null);
    this.intentService.saveIntentToApi(updated).subscribe({
      next: (saved) => {
        if (this.selectedIntent()?.id === intent.id) this.selectedIntent.set(saved);
        this.closeEditModal();
      },
      error: (err: Error) => {
        this.editLoading.set(false);
        this.saveError.set(err.message ?? 'Failed to save intent');
      },
    });
  }

  closeEditModal(): void {
    this.editModalIntent.set(null);
    this.editLoading.set(false);
  }

  // ---- New Intent modal events ----
  onNewIntentSave(formData: IntentFormData): void {
    const newIntent: Intent = {
      id: crypto.randomUUID(),
      name: formData.name,
      code: formData.code,
      domain: formData.domain,
      category: formData.category,
      description: formData.description,
      status: formData.status,
      strategy: formData.strategy,
      risk: formData.risk,
      authentication: formData.authentication,
      releasePhase: formData.releasePhase,
      trainingExamples: formData.trainingExamples,
      channels: formData.channels,
      apiCapabilities: formData.capabilityTags,
    };
    this.newModalLoading.set(true);
    this.saveError.set(null);
    this.intentService.createIntentViaApi(newIntent).subscribe({
      next: () => {
        this.newModalLoading.set(false);
        this.newModalOpen.set(false);
      },
      error: (err: Error) => {
        this.newModalLoading.set(false);
        this.saveError.set(err.message ?? 'Failed to create intent');
      },
    });
  }

  closeNewModal(): void {
    this.newModalOpen.set(false);
    this.newModalLoading.set(false);
  }

  // ---- Header buttons ----
  onReloadRegistry(): void { this.intentService.loadIntents(); }
  onFullRefresh(): void { this.intentService.loadIntents(); }
  onNewIntent(): void { this.newModalOpen.set(true); }

  // ---- Detail panel events ----
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
}
