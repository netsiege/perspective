import type { Host } from '@/types/data';
import styles from "./host.module.css";

type HostCardProps = {
  host: Host
}

export default function HostCard({host}: HostCardProps) {
  const claims = Object.values(host.claims);
  const owner = claims.find(claim => claim.owner);
  const inControlTeamID = owner ? owner.team_id : null;

  const services = Object.values(host.services);
  const servicesDown = services.filter(service => !service.last);
  return (
    <div className={styles.card}>
      <div className={styles.data}>
        <div>
          <p className={styles.name}>{host.name}</p>
          <hr className={styles.line}></hr>
          <p className={styles.ip}>{host.ip}</p>
        </div>
      </div>

      <div className={styles.data}>
        <p className={styles.owner}>owner: {inControlTeamID == -1 ? "none" : inControlTeamID}</p>
        <hr className={styles.line}></hr>
        {claims.map((claim) => 
          <p className={styles.items} key={`${claim.name}`}>{claim.name} : {inControlTeamID == -1 ? "none" : inControlTeamID}</p>
        )}
      </div>

      <div className={styles.data}>
        <p>services down</p>
        <hr className={styles.line}></hr>
        {servicesDown.map((service) => 
          <p className={styles.items} key={`${service.name}:${service.port}`}>{service.name}</p>
        )}
      </div>
    </div>
  );
}
