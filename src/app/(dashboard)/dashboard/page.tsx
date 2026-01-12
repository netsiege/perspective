"use client";

import { useEffect, useState, useMemo} from "react";
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

  const fakeClaims: Host[] =  [
    {
      "_id": 1,
      "name": "love",
      "ip": "192.168.220.12",
      "claims": [
        {
          "path": "/home/jacob/ctrl.txt",
          "owner": true,
          "name": "user",
          "team_id": 2,
          "value": 2
        },
        {
          "path": "/root/ctrl.txt",
          "owner": true,
          "name": "root",
          "team_id": -1,
          "value": 4
        }
      ],
      "services": [
        {
          "regex": "EmotionDetection API",
          "path": "/api/README.txt",
          "name": "project-share",
          "port": 21,
          "last": true
        }
      ]
    },
    {
      "_id": 2,
      "name": "anger",
      "ip": "192.168.220.13",
      "claims": [
        {
          "path": "/var/www/wordpress/ctrl.txt",
          "owner": false,
          "name": "web",
          "team_id": -1,
          "value": 1
        },
        {
          "path": "/home/steven/ctrl.txt",
          "owner": false,
          "name": "user",
          "team_id": -1,
          "value": 2
        },
        {
          "path": "/root/ctrl.txt",
          "owner": true,
          "name": "root",
          "team_id": -1,
          "value": 4
        }
      ],
      "services": [
        {
          "regex": "Welcome To Emotions Inc.",
          "path": "/index.php",
          "name": "website",
          "port": 80,
          "last": true
        }
      ]
    },
];

  const fakeTeams: Team[] = [
    {
      "_id":1,
      "name":"red",
      "token": 2,
      "points": 30
  },
  {
      "_id":2,
      "name":"blue",
      "token":3,
      "points": 70
  },
  {
      "_id":3,
      "name":"green",
      "token":55,
      "points": 1003
  },
  {
      "_id":4,
      "name":"black",
      "token":90,
      "points": 20
  }
  ]

  const [data, setData] = useState<Host[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const { isAuthenticated, teamId } = useAuth();

  type ControlBox = Host & {
    teamName?: string;
  };

  useEffect(() => {
    // Get initial data
    setData(fakeClaims);
    setTeams(fakeTeams);
    // axios.get(`${backendHost}api/boxes`).then((res) => {
    //   console.log(res.data)
    //   setData(res.data);
    // })

    // axios.get(`${backendHost}api/teams`).then((res) => {
    //   console.log("Teams:", res.data);
    //   setTeams(res.data);
    // });

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

  const teamMap = useMemo(() => {
    const map = new Map<number, string>();
    teams.forEach(team => {
        map.set(team._id, team.name);
    });
    return map;
    }, [teams]);
  
  const controlBoxes: ControlBox[] = useMemo(() => {
    return data
      .filter(host => teamId
          ? host.claims.some(claim => claim.team_id === teamId)
          : true
      )
      .map(host => {
        const ownerClaim = host.claims.find(claim => claim.owner === true);
  
        return {
          ...host,
          teamName: ownerClaim
            ? teamMap.get(ownerClaim.team_id) : 'Unclaimed'
        };
      });
  }, [data, teams, teamId, teamMap]);
  
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
