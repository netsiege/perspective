import type { Host } from '@/types/data';
import styles from "./host.module.css";

type HostCardProps = {
  host: Host
}

export default function HostCard({host}: HostCardProps) {
  const owner = host.claims.find(claim => claim.owner);
  const inControlTeamID = owner ? owner.team_id : null;

  const servicesDown = host.services.filter(service => !service.last);
  return (
    <div className={styles.card}>
      <div className={styles.data}>
        <div>
          <p>{host.name}</p>
          <hr></hr>
          <p>{host.ip}</p>
        </div>

        <div>
          <p>Owner: {inControlTeamID == -1 ? "none" : inControlTeamID}</p>
          <hr></hr>
          {host.claims.map((claim) => <p key={`${claim.name}`}>{claim.name} : {inControlTeamID == -1 ? "none" : inControlTeamID}</p>)}
        </div>

        <div>
          <p>Services Down</p>
          <hr></hr>
          {servicesDown.map((service) => <p key={`${service.name}:${service.port}`}>{service.name}</p>)}
        </div>
      </div>
    </div>
  );
}
