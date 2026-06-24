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
  releasePhase: string;
  trainingExamples: string[];
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
  releasePhase: '',
  trainingExamples: [],
  channels: [
    { name: 'WEB', active: true },
    { name: 'MOBILE', active: true },
    { name: 'VOICE', active: false },
    { name: 'SMS', active: false },
  ],
};
