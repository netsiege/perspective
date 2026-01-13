// import type { Team } from '@/types/data';
// import styles from './team.module.css';
// import copy from "copy-to-clipboard";
// import { useState } from 'react';

// type TeamCardProps = {
//   team: Team;
//   isAuthenticatedTeam?: boolean;
// };

// export default function TeamCard({ team, isAuthenticatedTeam = false }: TeamCardProps) {
//   const [copyText, setCopyText] = useState("");
//   const copyToClipboard = () => {
//     copy(copyText);
//     alert(`You have copied "${copyText}"`);
// };
//   return (
//     <div 
//       className={`${styles.card} ${isAuthenticatedTeam ? 'ring-4 ring-green-500 shadow-lg shadow-green-500/50' : ''}`}
//     >
//       <div className={styles.data}>
//         <div>
//           <p className={styles.name}>
//             {team.name}
//             {isAuthenticatedTeam && (
//               <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">Your Team</span>
//             )}
//           </p>
//           <hr className={styles.line} />
//           {/* <p className={styles.token}>Token: {team.token}</p>  */}
//           {/* {isAuthenticatedTeam ? <p className={styles.token}>Token: {team.token}</p> : <p></p>} */}
//           <p className={styles.points}>Points: {team.points}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

import type { Team } from '@/types/data';
import styles from './team.module.css';
import copy from 'copy-to-clipboard';
import { useState } from 'react';

type TeamCardProps = {
  team: Team;
  isAuthenticatedTeam?: boolean;
};

export default function TeamCard({ team, isAuthenticatedTeam = false }: TeamCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(team.token.toString());
    setCopied(true);

    setTimeout(() => setCopied(false), 2000); // reset after 2s
  };

  return (
    <div
      className={`${styles.card} ${
        isAuthenticatedTeam ? 'ring-4 ring-green-500 shadow-lg shadow-green-500/50' : ''
      }`}
    >
      <div className={styles.data}>
        <p className="text-white font-semibold text-lg">
          {team.name}
          {isAuthenticatedTeam && (
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
              Your Team
            </span>
          )}
        </p>

        <hr className={styles.line} />

        {/* Token input + copy button */}
        {isAuthenticatedTeam && (
          <div className="relative w-full max-w-[16rem] items-center rounded-lg bg-white/10 px-3 py-2 mb-2">
            <p className="text-white">Token: {team.token}</p>
            <button
              onClick={handleCopy}
              
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/20"
              aria-label="Copy token"
            >
              {copied ? (
              "Copied!"
              ) : (
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"/></svg>
              )}
            </button>
          </div>
        )}
        <div className="relative w-full max-w-[16rem] items-center rounded-lg bg-white/10 px-3 py-2">
        <p className="text-white">Points: {team.points}</p>
        </div>

      </div>
    </div>
  );
}
