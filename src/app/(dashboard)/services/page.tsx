"use client";

import { useEffect, useState } from "react";
import type { Host, UpdateService } from "@/types/data";
import axios from "axios";
import { socket } from "../socket";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";




export default function Services() {
  const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST;
  const eventName = process.env.NEXT_PUBLIC_EVENT_SERVICES;
  const [hosts, setHosts] = useState<Host[]>([]);

  useEffect(() => {
    // Get initial data
    axios.get(`${backendHost}api/boxes`).then((res) => {
      console.log(res.data);
      setHosts(res.data);
    });

    // Handle service updates
    const handleServiceUpdates = (incomingData: UpdateService) => {
      setHosts((currentHosts) => {
        return currentHosts.map((host) => {
          const newServices = incomingData[host._id];
          if (newServices !== undefined) {
            return { ...host, services: newServices };
          }
          return host;
        });
      });
    };

    // Listen for updates from socket
    socket.on(eventName!, handleServiceUpdates);

    // Cleanup
    return () => {
      socket.off(eventName!);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Services</h1>
      <div className="space-y-6">
        {hosts.map((host) => (
          <div key={host._id}>
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-[#ebdbb2]">{host.name}</h2>
              <p className="text-sm text-[#a89984]">{host.ip}</p>
            </div>
            <table className="table-fixed table-glow w-full rounded-lg overflow-hidden">
              <thead className="bg-[#504945]">
                <tr>
                  <th className="w-1/4 px-4 py-3 text-left text-sm font-medium text-white">Name</th>
                  <th className="w-1/5 px-4 py-3 text-left text-sm font-medium text-white">Status</th>
                  <th className="w-1/5 px-4 py-3 text-left text-sm font-medium text-white">Port</th>
                  <th className="w-auto px-4 py-3 text-left text-sm font-medium text-white">Path</th>
                </tr>
              </thead>
              <tbody>
                {host.services.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-sm text-[#ebdbb2]">
                      No services
                    </td>
                  </tr>
                ) : (
                  host.services.map((service, i) => (
                    <tr key={i} className="hover:bg-[#504945]/20 border-b border-[#504945]">
                      <td className="break-all px-4 py-3 text-sm text-white">{service.name}</td>
                      <td className="px-4 py-3">
                        <span className={service.last ? "text-[#8ec07c]" : "text-[#fb4934]"}>
                          {service.last ? (<button
                            className="flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#8ec07c]/20"
                            title="Running"
                          >
                            <FaArrowUp className="text-[#8ec07c]" />
                          </button>) : (<button
                            className="flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#cb241e]/20"
                            title="Running"
                          >
                            <FaArrowDown className="text-[#cb241e]" />
                          </button>)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white">{service.port}</td>
                      <td className="break-all px-4 py-3 text-sm text-white">{service.path}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
