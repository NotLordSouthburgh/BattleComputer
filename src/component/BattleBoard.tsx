import React from 'react';

import { InputTile } from '../component/InputTile';
import {
  AdversaryDisplayOrder,
  HeroDisplayOrder,
  UnitTypes,
} from '../logic/unitdefs';
import { useRecoilState, useRecoilValue } from 'recoil';
import { garrisonState, battleBoardState } from '../logic/recoil';
import { BattleOutcomePanel } from './BattleOutcome';
import { ActionButton } from './ActionButton';
import {
  BattleOutcomeToScore,
  BattleOutcomeToScoreElements,
  OptimiseForBattle,
} from '../logic/geneticOptimiser';
import { NiceHolder } from './NiceHolder';
import { CpuBreatherStart } from '../logic/utils';

export function BattleBoard() {
  const [battleBoard, setBattleBoard] = useRecoilState(battleBoardState);
  const [garrison, setGarrison] = useRecoilState(garrisonState);

  function ClearAllAdversary() {
    setBattleBoard({
      ...battleBoard,
      adversary: {},
    });
  }

  function ClearAllHeroes() {
    setBattleBoard({
      ...battleBoard,
      player: {},
    });
  }

  function PickTheTeam() {
    OptimiseForBattle({
      adversary: battleBoard.adversary,
      resources: garrison,
      callback: (choice) => {
        console.log('SETTING THIS TEAM:', choice);
        setBattleBoard({
          ...battleBoard,
          player: choice,
        });
      },
    });
  }

  return (
    <div className="">
      <div className="flex place-content-center bg-workbackground">
        <div className="flex flex-col">
          <NiceHolder>
            <h1>Enemy Camp</h1>
            <ActionButton label="Clear All" onClick={ClearAllAdversary} />
            {AdversaryDisplayOrder.map((type) => (
              <InputTile unittype={type} key={type} />
            ))}
          </NiceHolder>
        </div>
        <div className="flex flex-col">
          <NiceHolder>
            <BattleOutcomePanel />
          </NiceHolder>
        </div>
        <NiceHolder>
          <div className="flex flex-col">
            <h1>Battlefield</h1>
            <ActionButton label="Clear All" onClick={ClearAllHeroes} />
            {HeroDisplayOrder.map((type) => (
              <InputTile unittype={type} key={type} />
            ))}
          </div>
        </NiceHolder>
        <NiceHolder>
          <div className="flex flex-col">
            <h1>Garrison</h1>
            <ActionButton label="Pick The Team" onClick={PickTheTeam} />
            {HeroDisplayOrder.map((type) => (
              <InputTile unittype={type} key={type} useGarrison />
            ))}
          </div>
        </NiceHolder>
      </div>
      {/* <pre>{`SCORE ${JSON.stringify(
          BattleOutcomeToScoreElements(battleOutcome),
          null,
          2
        )}`}</pre> */}
      {/* <code>
        <pre>{JSON.stringify(battleOutcome, null, 2)}</pre>
      </code> */}
    </div>
  );
}
