import { Strategy, RiskLevel, AuthType, IntentChannel } from '../../core/models/intent.model';

export interface FilterState {
  domain: string;
  risk: string;
  authentication: string;
  strategy: string;
  status: string;
}

export const EMPTY_FILTERS: FilterState = {
  domain: '', risk: '', authentication: '', strategy: '', status: '',
};

export interface IntentFormData {
  name: string;
  code: string;
  domain: string;
  category: string;
  description: string;
  status: 'Active' | 'Inactive';
  strategy: Strategy;
  risk: RiskLevel;
  authentication: AuthType;
  escalationRules: string;
  releasePhase: string;
  trainingExamples: string[];
  trainingLanguage: string;
  minExamples: number;
  capabilityTags: string[];
  backendServices: string;
  featureFlags: string;
  channels: IntentChannel[];
}

export const EMPTY_FORM_DATA: IntentFormData = {
  name: '',
  code: '',
  domain: '',
  category: '',
  description: '',
  status: 'Active',
  strategy: 'API',
  risk: 'LOW',
  authentication: 'NONE',
  escalationRules: '',
  releasePhase: '',
  trainingExamples: [],
  trainingLanguage: 'EN',
  minExamples: 5,
  capabilityTags: [],
  backendServices: '',
  featureFlags: '',
  channels: [
    { name: 'WEB', active: false },
    { name: 'MOBILE', active: false },
    { name: 'VOICE', active: false },
    { name: 'SMS', active: false },
  ],
};
