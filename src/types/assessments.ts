// Types for patient assessments (ABEMID and NEAD)

export type AssessmentType = 'ABEMID' | 'NEAD';
export type AssessmentStatus = 'draft' | 'completed';
export type ABEMIDLevel = 'AD1' | 'AD2' | 'AD3';

// ABEMID Criteria Structure
export interface ABEMIDCriterion {
  code: string;
  description: string;
  level: ABEMIDLevel;
  category: string;
}

// NEAD Question Structure
export interface NEADQuestion {
  code: string;
  domain: string;
  description: string;
  maxScore: number;
}

// Answer for assessment questions
export interface AssessmentAnswer {
  questionCode: string;
  value: number | boolean | string;
  notes?: string;
}

// Main Assessment interface
export interface Assessment {
  id: string;
  patientId: string;
  patientName: string;
  type: AssessmentType;
  performedBy: string;
  performedByName: string;
  performedAt: Date;
  createdAt: Date;
  updatedAt?: Date;
  answers: AssessmentAnswer[];
  // For NEAD - calculated total score
  score?: number;
  // For ABEMID - determined level
  level?: ABEMIDLevel;
  notes?: string;
  status: AssessmentStatus;
}

// ABEMID Categories for the form
export interface ABEMIDCategory {
  name: string;
  criteria: ABEMIDCriterion[];
}

// NEAD Domains for the form
export interface NEADDomain {
  name: string;
  questions: NEADQuestion[];
}
