import './App.css';

import React from 'react';
import ReactGA from 'react-ga4';
import { RecoilRoot } from 'recoil';

import glasses from './asset/DWI.png';
import southburgh from './asset/Southburgh.png';
import { BattleBoard } from './component/BattleBoard';
import { Footer } from './component/Footer';
import { UnitTypes } from './logic/unitdefs';
import { Instructions } from './component/Instructions';

ReactGA.initialize('G-44ZPLMVXX1');
ReactGA.send('pageview');

const theirs: UnitTypes[] = [
  // Hitters
  'orkling',
  'raider',
  'veteran',

  // Shooters
  'hunter',
  'elitehunter',
  'sniper',
  'demolisher',
  // Horsers
  'warg',
  'vanguard',
  // Bossers
  'boss1',
  'boss2',
  'boss3',
  'boss4',
];

const mine: UnitTypes[] = [
  'militia',
  'footsoldier',
  'knight',
  'horse2',
  'cavalry',
  'archer',
  'longbow',
  'crossbow',
  'cannon',
];

function App() {
  return (
    <RecoilRoot>
      <div className="flex flex-col">
        <style>{'body { background-color: #A18D76; }'}</style>
        <div className="flex flex-row items-center justify-end">
          <div>
            <h1 className="text-3xl font-bold">
              Not Lord Southburgh's Battle Computer™
            </h1>
            v220724
            {/* Click here for Manual */}
          </div>
          <div className="h-36 shrink-0 ml-2">
            <img
              className="h-36 w-36 top-0 left-0"
              src={southburgh}
              alt="Not Lord Southburgh"
            />
            <img
              className="h-36 w-36 relative -top-32 left-0"
              src={glasses}
              alt="Not Lord Southburgh"
            />
          </div>
        </div>

        <BattleBoard />
        <Footer></Footer>
        <Instructions />
      </div>
    </RecoilRoot>
  );
}

export default App;
