/**
 * Travel Fleet & Driver Domain Interfaces
 * Kontrak data tersentralisasi untuk ekosistem armada travel B2B.
 */

export type DriverStatus = 'ready' | 'caution' | 'stand_down' | 'on_trip';
export type DispatcherDecision = 'pending' | 'dispatched_solo' | 'co_driver_assigned' | 'stand_down_issued';

export interface Driver {
  id: number;
  nip: string;
  name: string;
  age: number;
  vehicle_type: string;
  license_plate: string;
  address: string;
  medical_history: string;
  status: DriverStatus;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TripHistory {
  id: number;
  driver_id: number;
  route_name: string;
  departure_time: string;
  arrival_time?: string;
  distance_km: number;
  status: 'completed' | 'in_transit' | 'scheduled';
  notes?: string;
  created_at?: string;
}

export interface AssessmentRecord {
  id: number;
  driver_id: number;
  timestamp: string;
  cfi_score: number;
  impairment_tier: string;
  is_fit_for_duty: number;
  pvt_mean_rt: number;
  pvt_lapses: number;
  stroop_accuracy: number;
  motor_cadence: number;
  corsi_max_span?: number;
  braking_distance_meters: number;
  microsleep_risk: string;
  dispatcher_recommendation: string;
  dispatcher_decision: DispatcherDecision;
  dispatcher_notes?: string;
  headline_title?: string;
  short_summary?: string;
  raw_json?: string;
  driver_name?: string;
  driver_nip?: string;
  vehicle_type?: string;
  license_plate?: string;
}

export interface DriverWithLatestAssessment extends Driver {
  latestAssessment?: AssessmentRecord | null;
  activeTrip?: TripHistory | null;
  recentTrips?: TripHistory[];
  assessmentsCount?: number;
}

export interface FleetSummary {
  totalDrivers: number;
  readyCount: number;
  cautionCount: number;
  standDownCount: number;
  onTripCount: number;
  avgReactionTimeMs: number;
  avgBrakingDistanceMeters: number;
  fleetAlertLevel: 'optimal' | 'elevated' | 'high_risk';
}
