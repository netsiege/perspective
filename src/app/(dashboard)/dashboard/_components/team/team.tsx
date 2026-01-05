import type { Team } from '@/types/data';
import styles from './team.module.css';

type TeamCardProps = {
  team: Team;
  isAuthenticatedTeam?: boolean;
};

export default function TeamCard({ team, isAuthenticatedTeam = false }: TeamCardProps) {
  return (
    <div 
      className={`${styles.card} ${isAuthenticatedTeam ? 'ring-4 ring-green-500 shadow-lg shadow-green-500/50' : ''}`}
    >
      <div className={styles.data}>
        <div>
          <p className={styles.name}>
            {team.name}
            {isAuthenticatedTeam && (
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">Your Team</span>
            )}
          </p>
          <hr className={styles.line} />
          {isAuthenticatedTeam ? <p className={styles.token}>Token: {team.token}</p> : <p></p>}
          {/* <p className={styles.token}>Token: {team.token}</p> */}
          <p className={styles.points}>Points: {team.points}</p>
        </div>
      </div>
    </div>
  );
}