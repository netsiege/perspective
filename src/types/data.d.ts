export interface Host {
  _id: number,
  name: string,
  ip: string,
  claims: Record<string, Claim>,
  services: Record<string, Service>
}

export interface Claim {
  name: string,
  team_id: number,
  path: string,
  owner: boolean,
  value: number
}

export interface Service {
  regex: string,
  path: string,
  name: string,
  port: number,
  last: boolean // Represents if the service is up or down
}

export interface Team {
  _id: number,
  name: string,
  token: number,
  points: number
}

export interface UpdateClaim {
  [host_id: number] : Record<string, Claim>
}

export interface UpdateService {
  [host_id: number] : Record<string, Service>
}

export interface AuthResponse {
  message: string;
  team_id: number;
  team_name: string;
  session_id: string;
  token: string;
  expires_in: number;
}

export interface TeamSession {
  token: string;
  team_id: number;
  team_name: string;
  expires_at: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  teamId: number | null;
  teamName: string | null;
  loading: boolean;
}

export interface VerifyResponse {
  valid: boolean;
  team_id: number;
  team_name: string;
}


