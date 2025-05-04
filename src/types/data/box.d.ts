export interface Box {
  _id: number,
  name: string,
  ip: string,
  controls: Array<Flag>,
  services: Array<Service>
}

export interface Flag {
  path: string,
  owner: boolean,
  name: string,
  team_id: number,
  points: number
}

export interface Service {
  regex: string,
  path: string,
  name: string,
  port: number,
  last: boolean // Represents if the service is up or down
}