import React, { useEffect, useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { BattleOutcome } from '../logic/battle';

import { battleOutcomeState } from '../logic/recoil';
import { AdversaryDisplayOrder, HeroDisplayOrder } from '../logic/unitdefs';
import { BattleBar } from './BattleBar';
import { UnitOutcome } from './UnitOutcome';

export function BattleOutcomePanel() {
  const [cachedBattle, setCachedBattle] = useState<null | BattleOutcome>(null);

  const battleOutcomeLoad = useRecoilValueLoadable(battleOutcomeState);

  let battleOutcomeSelect: null | BattleOutcome = null;
  if (battleOutcomeLoad.state === 'hasValue') {
    battleOutcomeSelect = battleOutcomeLoad.contents;
    if (cachedBattle !== battleOutcomeSelect) {
      setCachedBattle(battleOutcomeSelect);
    }
  } else {
    battleOutcomeSelect = cachedBattle;
  }

  if (battleOutcomeSelect === null) return null;
  const battleOutcome = battleOutcomeSelect;

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
