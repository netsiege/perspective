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
          <hr />
          <p className={styles.id}>Team ID: {team._id}</p>
        </div>

        <div>
          <p className={styles.token}>Token: {team.token}</p>
          <hr />
          <p className={styles.points}>Points: {team.points}</p>
        </div>
      </div>
    </div>
  );
}