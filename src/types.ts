/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DbRecord {
  id: string;
  username: string;
  role: string;
  email: string;
  balance?: number;
  lastLogin: string;
  dbType: 'PostgreSQL' | 'MySQL' | 'MongoDB';
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'EXPLOIT' | 'SECURITY';
  message: string;
  queryTrace?: string;
}

export interface ThreatIncident {
  id: string;
  timestamp: string;
  attackerIp: string;
  attackerNode: string;
  attackType: string;
  payloadUsed: string;
  severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
  details: string;
}

export interface PhishingScanResult {
  url: string;
  isPhishing: boolean;
  score: number; // 0 - 100
  sslValid: boolean;
  domainAge: string;
  ipAddress: string;
  indicators: string[];
}
