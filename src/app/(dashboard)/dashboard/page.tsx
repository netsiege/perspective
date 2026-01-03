"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import HostCard from "./_components/host/host";
import TeamCard from "./_components/team/team";
import type { Host, Team, UpdateClaim, UpdateService } from "@/types/data"
import axios from "axios";
import styles from "./page.module.css";

export default function Dashboard() {
  const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST;
  const eventNames = {
    claims: process.env.NEXT_PUBLIC_EVENT_CLAIMS,
    services: process.env.NEXT_PUBLIC_EVENT_SERVICES,
    teams: process.env.NEXT_PUBLIC_EVENT_TEAMS
  }

  const [data, setData] = useState<Host[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    // Get initial data
    axios.get(`${backendHost}api/boxes`).then((res) => {
      console.log(res.data)
      setData(res.data);
    })

    axios.get(`${backendHost}api/teams`).then((res) => {
      console.log("Teams:", res.data);
      setTeams(res.data);
    });

    // Listen for updates from socket
    socket.on(eventNames.claims!, handleClaimUpdates);
    socket.on(eventNames.services!, handleServiceUpdates);
    socket.on(eventNames.teams!, handleTeamUpdates);

    // Cleanup
    return () => {
      socket.off(eventNames.claims!);
      socket.off(eventNames.services!);
      socket.off(eventNames.teams!);
    };
  }, []);


  type HostProps = "claims" | "services";
  const updateHostProp = (currentData: Host[], incomingData: UpdateClaim | UpdateService, prop: HostProps) : Host[] => {
    return currentData.map((host) => {
      const newData = incomingData[host._id];
      if (newData !== undefined) {
        return { ...host, [prop]: newData}
      }
      return host;
    });
  }

  const handleClaimUpdates = (incomingData: UpdateClaim) => {
    setData((currentData) => updateHostProp(currentData, incomingData, "claims"));
  }

  const handleServiceUpdates = (incomingData: UpdateService) => {
    setData((currentData) => updateHostProp(currentData, incomingData, "services"));
  }

  const handleTeamUpdates = (incomingData: Team[]) => {
    setTeams(incomingData);
  };
  
  return (
    <div>
        <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
    

      <div className={styles.boxes}>
        {data.map((host) => (
          <HostCard key={host._id} host={host}/>
        ))}
      </div>
      <div className={styles.boxes}>
        {teams.map((team) => (
          <TeamCard key={team._id} team={team} />
        ))}
      </div>
    </div>
  );
}
