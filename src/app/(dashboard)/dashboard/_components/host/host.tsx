import type { Host } from '@/types/data';
import styles from "./host.module.css";

type ControlBox = Host & {
    teamName?: string;
  };

type HostCardProps = {
  host: ControlBox,
  teamMap: Map<number, string>
}

export default function HostCard({host, teamMap}: HostCardProps) {
  const claims = Object.values(host.claims);
  const owner = claims.find(claim => claim.owner);
  const inControlTeamID = owner ? owner.team_id : null;
  
  const services = Object.values(host.services);
  const servicesDown = services.filter(service => !service.last);
  return (
    <div className={styles.card}>
      <div className={styles.data}>
        <div>
          <p className="text-white text-lg font-semibold">{host.name}</p>
          <hr className={styles.line}></hr>
          <p className="text-[#a89984]">{host.ip}</p>
        </div>
      </div>

      <div className={styles.data}>
        <p className="text-white font-semibold">owner: {inControlTeamID == -1 ? "none" : host.teamName}</p>
        <hr className={styles.line}></hr>
        {claims.map((claim) => {
          const displayTeamId = inControlTeamID !== -1 && inControlTeamID !== null ? inControlTeamID : claim.team_id;
          return (
            <p className={styles.items} key={`${claim.name}`}>{claim.name} : {displayTeamId == -1 ? "none" : teamMap.get(displayTeamId)}</p>
          );
        })}
      </div>

      <div className={styles.data}>
        <p className="text-white font-semibold">services down</p>
        <hr className={styles.line}></hr>
        {servicesDown.map((service) => 
          <p className="text-[#a89984]" key={`${service.name}:${service.port}`}>{service.name}</p>
        )}
      </div>
    </div>
  );
}
