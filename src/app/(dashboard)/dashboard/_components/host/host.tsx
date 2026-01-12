import type { Host } from '@/types/data';
import styles from "./host.module.css";

type ControlBox = Host & {
    teamName?: string;
  };

type HostCardProps = {
  host: ControlBox
}

export default function HostCard({host}: HostCardProps) {
  const owner = host.claims.find(claim => claim.owner);
  const inControlTeamID = owner ? owner.team_id : null;
  
//   const inControlTeamName = owner ? owner.name : null;

  const servicesDown = host.services.filter(service => !service.last);
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
        {host.claims.map((claim) => 
          <p className="text-[#a89984]" key={`${claim.name}`}>{claim.name} : {inControlTeamID == -1 ? "none" : host.teamName}</p>
        )}
      </div>

      <div className={styles.data}>
        <p className="text-white font-semibold">services down</p>
        <hr className={styles.line}></hr>
        {servicesDown.map((service) => 
          <p className="ext-[#a89984]" key={`${service.name}:${service.port}`}>{service.name}</p>
        )}
      </div>
    </div>
  );
}
