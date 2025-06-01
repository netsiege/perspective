import type { Team } from '@/types/data';
import styles from './team.module.css';

type TeamCardProps = {
  team: Team;
};

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.data}>
        <div>
          <p className={styles.name}>{team.name}</p>
          <hr className={styles.line} />
          <p className={styles.token}>Token: {team.token}</p>
          <p className={styles.points}>Points: {team.points}</p>
        </div>
      </div>
    </div>
  );
}