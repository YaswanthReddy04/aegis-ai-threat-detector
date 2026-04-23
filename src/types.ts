export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ThreatAnalysis {
  threat_type: string;
  severity: Severity;
  confidence: number;
  explanation: string;
  remediation_steps: string[];
  threat_category: string;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  symptoms: string;
  result: ThreatAnalysis;
}
