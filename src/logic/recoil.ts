// The BattleBoard state, linking our logic to the react model.

import { BattleOutcome, BattleSetup, GetBattleOutcome } from './battle';
import { atom, RecoilState, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { BattleResources } from './geneticOptimiser';

const persistBattleBoard = recoilPersist({ key: 'battleboard' });
const persistGarrison = recoilPersist({ key: 'garrison' });
export const initialBattleBoard: BattleSetup = {
  adversary: {},
  player: {},
  rounds: 1000,
  deterministic: false,
};

export const battleBoardState: RecoilState<BattleSetup> = atom({
  key: 'BattleBoard',
  default: initialBattleBoard,
  effects_UNSTABLE: [persistBattleBoard.persistAtom],
});

const initialGarrison: BattleResources = {};

export const garrisonState: RecoilState<BattleResources> = atom({
  key: 'Garrison',
  default: initialGarrison,
  effects_UNSTABLE: [persistGarrison.persistAtom],
});

// const initialBattleOutcome: BattleSetup = {

// }

// const battleOutcomeState = atom({
//   key: 'BattleOutcome',
//   default: initialBattleBoard,
// });

// export const battleOutcomeState = selector({
//   key: 'BattleOutcome',
//   get: async ({ get }) => {
//     const board = get(battleBoardState);
//     const battleOutcome = await GetBattleOutcome(board);
//     return battleOutcome;
//   },
// });
