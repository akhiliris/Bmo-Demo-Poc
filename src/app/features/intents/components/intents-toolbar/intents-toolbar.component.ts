import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterState, EMPTY_FILTERS } from '../../intents.types';

@Component({
  selector: 'app-intents-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intents-toolbar.component.html',
  styleUrl: './intents-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntentsToolbarComponent {
  readonly searchQuery = input('');
  readonly intentsCount = input(0);
  readonly domainOptions = input<string[]>([]);
  readonly activeFilterCount = input(0);
  readonly appliedFilters = input<FilterState>({ ...EMPTY_FILTERS });

  readonly searchChange = output<string>();
  readonly filterApply = output<FilterState>();
  readonly filterReset = output<void>();
  readonly exportCsv = output<void>();

  readonly filterPanelOpen = signal(false);
  pendingFilters: FilterState = { ...EMPTY_FILTERS };

  toggleFilterPanel(): void {
    const opening = !this.filterPanelOpen();
    this.filterPanelOpen.set(opening);
    if (opening) this.pendingFilters = { ...this.appliedFilters() };
  }

  applyFilters(): void {
    this.filterApply.emit({ ...this.pendingFilters });
    this.filterPanelOpen.set(false);
  }

  resetFilters(): void {
    this.pendingFilters = { ...EMPTY_FILTERS };
    this.filterReset.emit();
    this.filterPanelOpen.set(false);
  }

  onSearchInput(value: string): void {
    this.searchChange.emit(value);
  }
}
