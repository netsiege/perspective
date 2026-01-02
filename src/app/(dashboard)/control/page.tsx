"use client";

import { useEffect, useState, useMemo } from "react";
import type { Host, Team, UpdateClaim, Claim } from "@/types/data";
import axios from "axios";
import { socket } from "../socket";

type ClaimWithHost = Claim & {
  hostId: number;
  hostName: string;
  hostIp: string;
  port?: number;
};

export default function Control() {
  const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST;
  const eventNames = {
    claims: process.env.NEXT_PUBLIC_EVENT_CLAIMS,
  };
  const [hosts, setHosts] = useState<Host[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    // Get initial data
    axios.get(`${backendHost}api/boxes`).then((res) => {
      console.log(res.data);
      setHosts(res.data);
    });
    axios.get(`${backendHost}api/teams`).then((res) => {
      console.log("Teams:", res.data);
      setTeams(res.data);
    });

    // Handle claim updates
    const handleClaimUpdates = (incomingData: UpdateClaim) => {
      setHosts((currentHosts) => {
        return currentHosts.map((host) => {
          const newClaims = incomingData[host._id];
          if (newClaims !== undefined) {
            return { ...host, claims: newClaims };
          }
          return host;
        });
      });
    };

    // Listen for updates from socket
    socket.on(eventNames.claims!, handleClaimUpdates);

    // Cleanup
    return () => {
      socket.off(eventNames.claims!);
    };
  }, []);

  // Map claims to teams based on team_id
  const teamClaims = useMemo(() => {
    const claimsByTeam: { [teamId: number]: ClaimWithHost[] } = {};

    hosts.forEach((host) => {
      host.claims.forEach((claim) => {
        // Map claim to team if team_id matches a team's _id
        // team_id of -1 means unclaimed
        if (claim.team_id !== -1) {
          const teamId = claim.team_id;
          if (!claimsByTeam[teamId]) {
            claimsByTeam[teamId] = [];
          }
          claimsByTeam[teamId].push({
            ...claim,
            hostId: host._id,
            hostName: host.name,
            hostIp: host.ip,
          });
        }
      });
    });

    return claimsByTeam;
  }, [hosts]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Control</h1>
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6 space-y-6">
        {teams.map((team) => {
          const claims = teamClaims[team._id] || [];
          return (
            <div key={team._id}>
              <div className="flex space-x-8 items-center mb-2">
                <h2 className="text-lg font-semibold text-[#ebdbb2]">{team.name}</h2>
                <p className="text-base text-[#a89984]">Points: {team.points}</p>
              </div>
              <table className=" table-glow w-full rounded-lg overflow-hidden">
                <thead className="bg-[#504945]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Host</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Claim Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Path</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white">Port</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 text-center text-sm text-white">
                        No claims
                      </td>
                    </tr>
                  ) : (
                    claims.map((claim, i) => (
                      <tr key={i} className="border-b border-[#504945]">
                        <td className="px-4 py-3 text-sm text-white">
                          <div>{claim.hostName}</div>
                          <div className="text-xs text-[#928374ff]">{claim.hostName}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">{claim.name}</td>
                        <td className="px-4 py-3 text-sm text-white">{claim.path}</td>
                        <td className="px-4 py-3 text-sm text-white">{claim.port || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
