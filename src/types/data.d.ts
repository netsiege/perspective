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
  [host_id: number] : Array<Claim>
}

export interface UpdateService {
  [host_id: number] : Array<Service>
}


