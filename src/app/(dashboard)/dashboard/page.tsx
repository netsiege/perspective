"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import HostCard from "./_components/host/host";
import TeamCard from "./_components/team/team";
import type { Host, Team, UpdateClaim, UpdateService } from "@/types/data"
import axios from "axios";
import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST;
  const eventNames = {
    claims: process.env.NEXT_PUBLIC_EVENT_CLAIMS,
    services: process.env.NEXT_PUBLIC_EVENT_SERVICES,
    teams: process.env.NEXT_PUBLIC_EVENT_TEAMS
  }

  const [data, setData] = useState<Host[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const { isAuthenticated, teamId } = useAuth();

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
  
  // Only show authenticated team first
  const visibleTeams =
  isAuthenticated && teamId
    ? teams.filter(team => team._id === teamId)
    : teams;

  // Only show boxes that teams control
  const controlBoxes = isAuthenticated && teamId ? data.filter(host => host.claims.some(claim => claim.team_id === teamId)) : data;
  
  return (
    <div>
      <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">
        Dashboard
      </h1>

      {/* {isAuthenticated && (
        <div className="rounded-lg bg-[#a89984]/10 border border-2 border-[#a89984] px-4 py-2">
          <p className="text-sm text-white">
            Viewing as authenticated team
          </p>
        </div>
      )} */}
    </div>

    {isAuthenticated && controlBoxes.length === 0 && (
      <div className="px-6 pb-2">
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3">
          <p className="text-sm text-red-400">
            Your team does not control any boxes yet
          </p>
        </div>
      </div>
    )}
      <div className={styles.boxes}>
        {controlBoxes.map((host) => (
          <HostCard key={host._id} host={host}/>
        ))}
      </div>
      <div className={styles.boxes}>
        {visibleTeams.map((team) => (
          <TeamCard 
            key={team._id} 
            team={team} 
            isAuthenticatedTeam={isAuthenticated && team._id === teamId}
          />
        ))}
      </div>
    </div>
  );
}
