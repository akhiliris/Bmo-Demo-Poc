import { Component, input, output, signal, computed, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Intent } from '../../../../core/models/intent.model';
import { IntentService } from '../../../../core/services/intent.service';
import { IntentFormData, EMPTY_FORM_DATA } from '../../intents.types';

export type ModalMode = 'new' | 'edit';
export type ModalTab = 'basic' | 'classification' | 'training' | 'capabilities' | 'channels';

const TAB_ORDER: ModalTab[] = ['basic', 'classification', 'training', 'capabilities', 'channels'];

@Component({
  selector: 'app-intent-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intent-modal.component.html',
  styleUrl: './intent-modal.component.scss',
})
export class IntentModalComponent implements OnChanges {
  readonly intentService = inject(IntentService);

  readonly intent = input<Intent | null>(null);
  readonly loading = input(false);

  readonly save = output<IntentFormData>();
  readonly close = output<void>();

  readonly activeTab = signal<ModalTab>('basic');
  newExampleText = '';
  formData: IntentFormData = this._cloneEmpty();

  readonly mode = computed<ModalMode>(() => this.intent() ? 'edit' : 'new');
  readonly modalTitle = computed(() => this.mode() === 'edit' ? 'Edit Intent' : 'New Intent');
  readonly isLastTab = computed(() => this.activeTab() === 'channels');

  readonly categoryOptions = computed(() => {
    const domain = this.formData.domain;
    return domain ? this.intentService.getCategoriesForDomain(domain) : [];
  });

  ngOnChanges(): void {
    const intent = this.intent();
    if (intent) {
      this.formData = {
        name: intent.name,
        code: intent.code,
        domain: intent.domain,
        category: intent.category,
        description: intent.description ?? '',
        status: intent.status,
        strategy: intent.strategy,
        risk: intent.risk,
        authentication: intent.authentication,
        releasePhase: intent.releasePhase ?? '',
        trainingExamples: [...(intent.trainingExamples ?? [])],
        channels: intent.channels
          ? intent.channels.map(c => ({ ...c }))
          : EMPTY_FORM_DATA.channels.map(c => ({ ...c })),
      };
    } else {
      this.formData = this._cloneEmpty();
    }
    this.activeTab.set('basic');
    this.newExampleText = '';
  }

  setTab(tab: ModalTab): void { this.activeTab.set(tab); }

  goNext(): void {
    const idx = TAB_ORDER.indexOf(this.activeTab());
    if (idx < TAB_ORDER.length - 1) {
      this.activeTab.set(TAB_ORDER[idx + 1]);
    } else {
      this.onSave();
    }
  }

  addExample(): void {
    const text = this.newExampleText.trim();
    if (text && !this.formData.trainingExamples.includes(text)) {
      this.formData.trainingExamples = [...this.formData.trainingExamples, text];
    }
    this.newExampleText = '';
  }

  removeExample(ex: string): void {
    this.formData.trainingExamples = this.formData.trainingExamples.filter(e => e !== ex);
  }

  onDomainChange(): void { this.formData.category = ''; }

  onSave(): void { this.save.emit({ ...this.formData }); }
  onClose(): void { this.close.emit(); }

  isBasicValid(): boolean {
    return !!(this.formData.name?.trim() && this.formData.code?.trim());
  }

  private _cloneEmpty(): IntentFormData {
    return {
      ...EMPTY_FORM_DATA,
      channels: EMPTY_FORM_DATA.channels.map(c => ({ ...c })),
    };
  }
}
