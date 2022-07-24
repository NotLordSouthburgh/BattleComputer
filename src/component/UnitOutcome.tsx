import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      className={`p-0.5 m-1 mx-auto rounded-xl flex flex-row items-stretch bg-tiley_dark`}
    >
      <div className='w-full rounded-xl p-2 bg-tiley2 border-t-4 border-b-4 border-t-tiley_high border-b-tiley_low flex flex-col place-content-center'>

      <div
        className="text-white"
        // style={{ textShadow: '0 2px 4px rgba(0,0,0,1);' }}
      >
        {data.name}
      </div>
      {/* <BattleBar ratioAliveMax={realHPRemain} ratioAliveMin={realHPRemain} /> */}
      {/* <BattleBar
        ratioAliveMax={retainedHPRemain}
        ratioAliveMin={retainedHPRemain}
      /> */}
      <div className="flex flex-row space-x-1 items-center w-full justify-center">
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
        <span className='text-4xl text-white'>{startCount}&nbsp;</span>
        <FontAwesomeIcon icon={"fa-solid fa-play" as any} color="#ffF"/>
        <div className='flex flex-col'>
          <span className='text-greeny_high text-right w-full'>{~~(10 * (startCount - outcome.dead_avg)) / 10}&nbsp;<FontAwesomeIcon icon={"fa-solid fa-heart" as any} /></span>
          <span  className='text-red-200 text-right w-full'>{"-"+String(~~(10 * (outcome.dead_avg)) / 10)}&nbsp;<FontAwesomeIcon icon={"fa-solid fa-skull-crossbones" as any} /></span>
        </div>
      </div>
      <BattleBar {...{ ratioAliveMax, ratioAliveMin }} />

      </div>
    </div>
  );
}
