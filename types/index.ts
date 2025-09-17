
export interface Player {
  id: string;
  name: string;
  dateOfBirth: Date;
  position: PlayerPosition;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  teamIds: string[];
  isAvailable: boolean;
  eligibility: EligibilityStatus;
}

export interface Team {
  id: string;
  name: string;
  playerIds: string[];
  totalOwed: number;
  formation: Formation;
  createdAt: Date;
}

export type PlayerPosition = 
  | 'Goalkeeper' 
  | 'Defender' 
  | 'Midfielder' 
  | 'Forward';

export type PaymentMethod = 'Cash' | 'Card' | 'Transfer' | 'Venmo' | 'Check';

export type EligibilityStatus = 'Eligible' | 'Ineligible' | 'Suspended' | 'Injured';

export type Formation = 
  | '4-4-2' 
  | '4-3-3' 
  | '3-5-2' 
  | '4-2-3-1' 
  | '5-3-2';

export interface FinancialSummary {
  totalCollected: number;
  totalOwed: number;
  balance: number;
}

export interface FormationPosition {
  x: number;
  y: number;
  position: PlayerPosition;
  playerId?: string;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  isDefault: boolean;
}
