"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import HostCard from "./_components/host";
import type { Host, UpdateClaim, UpdateService } from "@/types/data"
import axios from "axios";
import { eventNames } from "@/types/event-names";
import styles from "./page.module.css";

export default function Home() {

  const [data, setData] = useState<Host[]>([]);
  useEffect(() => {
    // Get initial data
    axios.get("http://localhost:3000/data/test-data.json").then((res) => {
      setData(res.data);
    })

    // Listen for updates from socket
    socket.on(eventNames.claims, handleClaimUpdates);
    socket.on(eventNames.services, handleServiceUpdates);

    // Cleanup
    return () => {
      socket.off(eventNames.teams);
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
      Dashboard Page
      <div className={styles.boxes}>
        {data.map((host) => (
          <HostCard key={host._id} host={host}/>
        ))}
      </div>
    </div>
  );
}
