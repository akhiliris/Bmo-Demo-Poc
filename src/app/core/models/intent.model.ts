export type Strategy = 'API' | 'RAG' | 'HYBRID' | 'ESCALATE';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type AuthType = 'AUTHENTICATED' | 'STEP_UP' | 'NONE';
export type IntentStatus = 'Active' | 'Inactive';

export interface IntentChannel {
  name: string;
  active: boolean;
}

export interface Intent {
  id: string;
  name: string;
  code: string;
  domain: string;
  category: string;
  strategy: Strategy;
  risk: RiskLevel;
  authentication: AuthType;
  status: IntentStatus;
  description?: string;
  releasePhase?: string;
  apiCapabilities?: string[];
  trainingExamples?: string[];
  channels?: IntentChannel[];
}
