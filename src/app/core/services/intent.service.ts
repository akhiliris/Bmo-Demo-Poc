import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Intent, IntentChannel } from '../models/intent.model';

const API_URL = 'https://9s7p5x51i0.execute-api.us-east-2.amazonaws.com/dev/apis/services/unified';

interface ApiIntent {
  intent_id: string;
  name: string;
  description: string;
  domain_id: string;
  domain_name: string;
  category_id: string;
  category_name: string;
  resolution_strategy: string;
  risk_tier: string;
  auth_level: string;
  rollout_phase: string;
  allowed_capability_tags: string[];
  examples: string[];
  enabled: boolean;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: ApiIntent[];
}

const DEFAULT_CHANNELS: IntentChannel[] = [
  { name: 'WEB', active: true },
  { name: 'MOBILE', active: true },
  { name: 'VOICE', active: false },
  { name: 'SMS', active: false },
];

function mapApiIntent(a: ApiIntent): Intent {
  return {
    id: a.intent_id,
    name: a.name,
    code: a.intent_id,
    domain: a.domain_name,
    category: a.category_name,
    strategy: (a.resolution_strategy as Intent['strategy']) ?? 'API',
    risk: (a.risk_tier as Intent['risk']) ?? 'LOW',
    authentication: (a.auth_level as Intent['authentication']) ?? 'NONE',
    status: a.enabled ? 'Active' : 'Inactive',
    description: a.description,
    releasePhase: a.rollout_phase,
    apiCapabilities: a.allowed_capability_tags ?? [],
    trainingExamples: a.examples ?? [],
    channels: DEFAULT_CHANNELS,
  };
}

@Injectable({ providedIn: 'root' })
export class IntentService {
  private readonly http = inject(HttpClient);
  private readonly _intents = signal<Intent[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly intents = this._intents.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly totalIntents = computed(() => this._intents().length);
  readonly activeCount = computed(() => this._intents().filter(i => i.status === 'Active').length);
  readonly apiEnabledCount = computed(() => this._intents().filter(i => i.strategy === 'API').length);
  readonly ragEnabledCount = computed(() => this._intents().filter(i => i.strategy === 'RAG').length);

  constructor() {
    this.loadIntents();
  }

  loadIntents(): void {
    this._loading.set(true);
    this._error.set(null);
    this.http.post<ApiResponse>(API_URL, { resource: '/intents', method: 'GET', data: {}, query: {} })
      .subscribe({
        next: (res) => {
          this._intents.set((res.data ?? []).map(mapApiIntent));
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set(err?.message ?? 'Failed to load intents');
          this._loading.set(false);
        },
      });
  }

  updateIntent(updated: Intent): void {
    this._intents.update(list => list.map(i => i.id === updated.id ? updated : i));
  }

  deleteIntent(id: string): void {
    this._intents.update(list => list.filter(i => i.id !== id));
  }

  addIntent(intent: Intent): void {
    this._intents.update(list => [...list, intent]);
  }
}
