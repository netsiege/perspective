"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import HostCard from "./_components/host/host";
import type { Host, UpdateClaim, UpdateService } from "@/types/data"
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
  useEffect(() => {
    // Get initial data
    axios.get(`${backendHost}boxes`).then((res) => {
      setData(res.data);
    })

    // Listen for updates from socket
    socket.on(eventNames.claims!, handleClaimUpdates);
    socket.on(eventNames.services!, handleServiceUpdates);

    // Cleanup
    return () => {
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
  
  return (
    <div>
      <div className={styles.boxes}>
        {data.map((host) => (
          <HostCard key={host._id} host={host}/>
        ))}
      </div>
    </div>
  );
}
