import React, { useState } from 'react';

import { BattleUnitOutcome } from '../logic/battle';
import { UnitDefs, UnitTypes } from '../logic/unitdefs';
import { BattleBar } from './BattleBar';

type UnitOutcomeProps = {
  unittype: UnitTypes;
  outcome: BattleUnitOutcome;
};

export function UnitOutcome({ unittype, outcome }: UnitOutcomeProps) {
  const data = UnitDefs[unittype];
  if (!data) throw new Error('Unknown unit type ' + unittype);

  const startCount = outcome.start_count;

  const ratioAliveMax = (startCount - outcome.dead_min) / startCount;
  const ratioAliveMin = (startCount - outcome.dead_max) / startCount;

  const realHPRemain = outcome.real_hp / outcome.full_hp;
  const retainedHPRemain = outcome.retained_hp / outcome.full_hp;

  return (
    <div
      style={{ width: '18rem' }}
      className={`p-0 m-1 mx-auto rounded flex flex-col items-center  ${
        true ? 'bg-tilebackground' : 'bg-disabled'
      }`}
    >
      <div
        className="text-white"
        // style={{ textShadow: '0 2px 4px rgba(0,0,0,1);' }}
      >
        {data.name}
      </div>
      <BattleBar {...{ ratioAliveMax, ratioAliveMin }} />
      <BattleBar ratioAliveMax={realHPRemain} ratioAliveMin={realHPRemain} />
      {/* <BattleBar
        ratioAliveMax={retainedHPRemain}
        ratioAliveMin={retainedHPRemain}
      /> */}
      <div className="flex flex-row space-x-1">
        <div className=" flex h-18 w-18 min-w-18">
          <img
            className="h-12 w-12 relative top-0 left-0"
            src={data.unitURL}
            alt="Unit"
          />
          <img
            className="h-12 w-12 relative top-4 -left-6 -mr-6 mb-6"
            src={data.weaponURL}
            alt="Weapon"
          />
        </div>
        <span>{`${startCount} -> ${
          ~~(100 * (startCount - outcome.dead_avg)) / 100
        }`}</span>
      </div>
    </div>
  );
}
