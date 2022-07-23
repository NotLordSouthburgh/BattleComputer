import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { BattleOutcome, BattleSetup, GetBattleOutcome } from '../logic/battle';
import { PauseOptimise, UnpauseOptimise } from '../logic/geneticOptimiser';
import { battleBoardState, initialBattleBoard } from '../logic/recoil';
import { AdversaryDisplayOrder, HeroDisplayOrder } from '../logic/unitdefs';
import { CpuBreatherStart } from '../logic/utils';
import { BattleBar } from './BattleBar';
import { UnitOutcome } from './UnitOutcome';

const defaultBattleOutcome: BattleOutcome = {
  adversary: {},
  adversaryHP: {
    real: 0,
    retained: 0,
    total: 0,
  },
  battleTime: 0,
  battleTimeStr: '',
  player: {},
  playerHP: {
    real: 0,
    retained: 0,
    total: 0,
  },
  setup: initialBattleBoard,
  winRatio: 1,
};

// function useBattleOutcome() {
//   // const [isOnline, setIsOnline] = useState(null);
//   const [battleOutcome, setbattleOutcome] = useState(defaultBattleOutcome);

//   useEffect(() => {
//     console.log("count2 changed!");
//   }, [count2]);

//   useEffect(() => {
//     function handleStatusChange(status) {
//       setIsOnline(status.isOnline);
//     }

//     ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
//     return () => {
//       ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
//     };
//   });

//   return isOnline;
// }

type UpdateState = {
  updating: boolean;
  prevBoard: string;
};

const initialUpdateState: UpdateState = {
  updating: false,
  prevBoard: '',
};

export function BattleOutcomePanel() {
  // OK I tried recoil's update but I didn't like it since it keeps cancelling the outcome as new choices come in, therefore the board never updates. That looks boring.
  // So instead I am making my own updater.

  const board = useRecoilValue(battleBoardState);
  const [battleOutcome, setbattleOutcome] = useState(defaultBattleOutcome);

  const [updateState, setUpdateState] = useState(initialUpdateState);

  useEffect(() => {
    // Check if the board has updated
    const boardJSON = JSON.stringify(board);
    if (updateState.updating) return;
    if (boardJSON === updateState.prevBoard) return; // No board change

    const kickOffUpdate = async (setup: BattleSetup, setupJSON: string) => {
      PauseOptimise();
      console.log('KICK OFF AN UPDATE');
      const breath = CpuBreatherStart();
      const battleOutcome = await GetBattleOutcome(setup, breath);
      setbattleOutcome(battleOutcome);

      // TODO: Might have to delay here
      UnpauseOptimise();
      setUpdateState({
        prevBoard: setupJSON,
        updating: false,
      });
    };

    // Trigger the update
    kickOffUpdate(board, boardJSON);
    setUpdateState({ prevBoard: boardJSON, updating: true });
  }, [board, updateState]);

  const playerRealHP =
    battleOutcome.playerHP.real / battleOutcome.playerHP.total;
  const playerRetainedHP =
    battleOutcome.playerHP.retained / battleOutcome.playerHP.total;
  const adversaryRealHP =
    battleOutcome.adversaryHP.real / battleOutcome.adversaryHP.total;
  const adversaryRetainedHP =
    battleOutcome.adversaryHP.retained / battleOutcome.adversaryHP.total;

  const winRatio = battleOutcome.winRatio;

  return (
    <div>
      <BattleBar ratioAliveMax={winRatio} ratioAliveMin={winRatio} />
      <br></br>
      <div className="flex flex-row">
        <div className="flex flex-col">
          <BattleBar
            ratioAliveMax={adversaryRealHP}
            ratioAliveMin={adversaryRealHP}
          />
          <BattleBar
            ratioAliveMax={adversaryRetainedHP}
            ratioAliveMin={adversaryRetainedHP}
          />

          {AdversaryDisplayOrder.filter((item) => {
            return (battleOutcome.setup.adversary[item] || 0) > 0;
          }).map((type) => (
            <UnitOutcome
              unittype={type}
              key={type}
              outcome={battleOutcome.adversary[type]}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <BattleBar
            ratioAliveMax={playerRealHP}
            ratioAliveMin={playerRealHP}
          />
          <BattleBar
            ratioAliveMax={playerRetainedHP}
            ratioAliveMin={playerRetainedHP}
          />
          {HeroDisplayOrder.filter((item) => {
            return (battleOutcome.setup.player[item] || 0) > 0;
          }).map((type) => (
            <UnitOutcome
              unittype={type}
              key={type}
              outcome={battleOutcome.player[type]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
