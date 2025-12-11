export interface PlayerData {
  numTeams: number;
  playersPerTeam: number;
  playerNames: string[];
}

export interface TeamAssignment {
  playerName: string;
  teamIndex: number;
  timestamp: number;
}

export type AssignmentMode = 'spin-wheel' | 'dice-roll' | 'shuffle-deck' | 'target-lock';

export interface ModeConfig {
  id: AssignmentMode;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}
