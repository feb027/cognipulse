/**
 * Authentication & Role Session Contracts
 */

import { DriverWithLatestAssessment } from './fleet';

export type UserRole = 'driver' | 'dispatcher';

export interface DriverSession {
  role: 'driver';
  driver: DriverWithLatestAssessment;
  token: string;
}

export interface DispatcherSession {
  role: 'dispatcher';
  username: string;
  name: string;
  token: string;
}

export type AuthSession = DriverSession | DispatcherSession;

export interface LoginDriverPayload {
  role: 'driver';
  nip: string;
  pin: string;
}

export interface LoginDispatcherPayload {
  role: 'dispatcher';
  username: string;
  password: string;
}

export type LoginPayload = LoginDriverPayload | LoginDispatcherPayload;
