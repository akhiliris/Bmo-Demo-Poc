import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Intent, IntentChannel } from '../models/intent.model';

const API_URL = 'https://9s7p5x51i0.execute-api.us-east-2.amazonaws.com/dev/apis/services/unified';

export interface ApiCategory {
  category_id?: string;
  category_name?: string;
  categoryId?: string;
  categoryName?: string;
  domain_id?: string;
  domain_name?: string;
  domainId?: string;
  domainName?: string;
  domain?: string;
  name?: string;
  id?: string;
}

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

interface IntentDetailResponse {
  status: boolean;
  message: string;
  data: ApiIntent | ApiIntent[];
}

interface CategoriesApiResponse {
  status: boolean;
  message: string;
  data: ApiCategory[];
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
    channels: [...DEFAULT_CHANNELS],
  };
}

/** Extract domain name from any possible field variant in API response */
function extractDomain(c: ApiCategory): string {
  return c.domain_name ?? c.domainName ?? c.domain ?? c.domain_id ?? c.domainId ?? '';
}

/** Extract category name from any possible field variant in API response */
function extractCategory(c: ApiCategory): string {
  return c.category_name ?? c.categoryName ?? c.name ?? c.category_id ?? c.categoryId ?? '';
}

@Injectable({ providedIn: 'root' })
export class IntentService {
  private readonly http = inject(HttpClient);
  private readonly _intents = signal<Intent[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _categories = signal<ApiCategory[]>([]);
  private readonly _domainOptions = signal<string[]>([]);

  readonly intents = this._intents.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly domainOptions = this._domainOptions.asReadonly();

  readonly totalIntents = computed(() => this._intents().length);
  readonly activeCount = computed(() => this._intents().filter(i => i.status === 'Active').length);
  readonly apiEnabledCount = computed(() => this._intents().filter(i => i.strategy === 'API').length);
  readonly ragEnabledCount = computed(() => this._intents().filter(i => i.strategy === 'RAG').length);

  constructor() {
    this.loadIntents();
    this.loadCategories();
  }

  loadIntents(): void {
    this._loading.set(true);
    this._error.set(null);
    this.http.post<ApiResponse>(API_URL, { resource: '/intents', method: 'GET', data: {}, query: {} })
      .subscribe({
        next: (res) => {
          const list = (res.data ?? []).map(mapApiIntent);
          this._intents.set(list);
          this._loading.set(false);
          // If categories haven't loaded domain options yet, derive from intents
          if (this._domainOptions().length === 0) {
            this._setDomainOptionsFromIntents(list);
          }
        },
        error: (err) => {
          this._error.set(err?.message ?? 'Failed to load intents');
          this._loading.set(false);
        },
      });
  }

  loadCategories(): void {
    this.http.post<CategoriesApiResponse>(API_URL, {
      resource: '/intents/categories', method: 'GET', data: {}, query: {},
    }).subscribe({
      next: (res) => {
        const data: ApiCategory[] = Array.isArray(res.data) ? res.data : [];
        this._categories.set(data);

        const domains = [...new Set(
          data.map(extractDomain).filter(d => d.length > 0)
        )].sort();

        if (domains.length > 0) {
          this._domainOptions.set(domains);
        } else if (this._intents().length > 0) {
          this._setDomainOptionsFromIntents(this._intents());
        }
      },
      error: () => {
        // Fall back to deriving from loaded intents
        if (this._intents().length > 0) {
          this._setDomainOptionsFromIntents(this._intents());
        }
      },
    });
  }

  getCategoriesForDomain(domain: string): string[] {
    const cats = this._categories();
    if (cats.length === 0) {
      // fallback from loaded intents
      return [...new Set(
        this._intents().filter(i => i.domain === domain).map(i => i.category)
      )].sort();
    }
    return [...new Set(
      cats.filter(c => extractDomain(c) === domain).map(extractCategory).filter(Boolean)
    )].sort();
  }

  loadIntentDetail(code: string): Observable<Intent> {
    return this.http.post<IntentDetailResponse>(API_URL, {
      resource: `/intents/${code}`,
      method: 'GET',
      data: {},
      query: {},
    }).pipe(
      map((res) => {
        const raw = Array.isArray(res.data) ? res.data[0] : res.data;
        return mapApiIntent(raw as ApiIntent);
      })
    );
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

  private _setDomainOptionsFromIntents(list: Intent[]): void {
    const domains = [...new Set(list.map(i => i.domain).filter(Boolean))].sort();
    this._domainOptions.set(domains);
  }
}
