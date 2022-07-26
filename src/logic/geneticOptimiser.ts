import { BattleCohort, BattleOutcome, GetBattleOutcome } from './battle';
import { geneticAlgorithmConstructor } from './geneticalgorithm';
import { CpuBreatherData, CpuBreatherStart } from './utils';
// import

// function mutationFunction(phenotype) {
// 	// make a random change to phenotype
//     	return phenotype
// }

// function crossoverFunction(phenotypeA, phenotypeB) {
// 	// move, copy, or append some values from a to b and from b to a
// 	return [ phenotypeA , phenotypeB ]
// }

// function fitnessFunction(phenotype) {
// 	var score = 0
// 	// use your phenotype data to figure out a fitness score
// 	return score
// }

// var firstPhenotype = {
// 	dummyKey : "dummyValue"
// 	// enter phenotype data here
// }

// var geneticAlgorithmConstructor = require('../index')
// var geneticAlgorithm = geneticAlgorithmConstructor({
//     mutationFunction: mutationFunction,
//     crossoverFunction: crossoverFunction,
//     fitnessFunction: fitnessFunction,
//     population: [ firstPhenotype ]
// });

// console.log("Starting with:")
// console.log( firstPhenotype )
// for( var i = 0 ; i < 100 ; i++ ) geneticAlgorithm.evolve()
// var best = geneticAlgorithm.best()
// delete best.score
// console.log("Finished with:")
// console.log(best)

type BattleSliders = {
  [unit: string]: number;
};

export type BattleResources = {
  [unit: string]: number;
};

type OptimiserConfig = {
  resources: BattleResources;
  adversary: BattleCohort;
  callback?: (choice: BattleCohort) => void;
};

/* -------------------------------------------------------------------------- */
/*                                  TEST AREA                                 */
/* -------------------------------------------------------------------------- */

type BattlePhenotype = {
  sliders: BattleSliders;
  score: null | number;
  knownWinner: boolean;
};

const FULLCOHORT = 100;

let SingletonCPUBreath: CpuBreatherData | null = null;

export function CancelOptimise() {
  console.log(
    'I THINK I NEED TO REWRITE THE CANCEL BIT SINCE IT ALL REFERENCES OUR GLOBAL CONSTANT AND THAT SUX'
  );
  if (SingletonCPUBreath === null) return;
  SingletonCPUBreath.cancelled = true;
  SingletonCPUBreath = null;
}

export function PauseOptimise() {
  console.log('Pause optimisation', SingletonCPUBreath);
  if (SingletonCPUBreath === null) return;
  SingletonCPUBreath.paused = true;
}

export function UnpauseOptimise() {
  console.log('UnPause optimisation', SingletonCPUBreath);
  if (SingletonCPUBreath === null) return;
  SingletonCPUBreath.paused = false;
}

export async function OptimiseForBattle(config: OptimiserConfig) {
  if (SingletonCPUBreath !== null) {
    console.log('Battle optimisation already in progress, cancelling');
    CancelOptimise();
  }
  SingletonCPUBreath = CpuBreatherStart();

  const allSliders = [...Object.keys(config.resources), 'nothing'];

  const cache: { [key: string]: number } = {};
  let cachemiss = 0;
  let cachehit = 0;

  function RandomPhenotype(): BattlePhenotype {
    const firstPhenotype: BattlePhenotype = {
      sliders: {},
      score: null,
      knownWinner: false,
    };

    allSliders.forEach((s) => (firstPhenotype.sliders[s] = Math.random()));
    return firstPhenotype;
  }

  const SlidersToCohort = (
    sliders: BattleSliders,
    resources: BattleResources
  ) => {
    const cohort: BattleCohort = {};
    allSliders.forEach((s) => (cohort[s] = 0));
    const currentSliders = { ...sliders };

    const SliderSum = () => {
      let sum = 0;
      allSliders.forEach((s) => (sum += currentSliders[s]));
      return sum;
    };

    const CountCohort = () => {
      let sum = 0;
      allSliders.forEach((s) => (sum += cohort[s]));
      return sum;
    };

    let loopFuse = 10;

    let cohortCount = 0;
    do {
      const SliderTotal = SliderSum();
      if (SliderTotal === 0) {
        // Escape hatch - no sliders are active so we activate "nothing" and escape
        currentSliders['nothing']++;
        continue;
      }

      const gapToFill = FULLCOHORT - cohortCount;
      allSliders.forEach((s) => {
        const amount = currentSliders[s];
        if (amount > 0) {
          const addition = Math.round((amount * gapToFill) / SliderTotal);
          cohort[s] += addition + 1;
          if (cohort[s] >= resources[s]) {
            cohort[s] = resources[s];
            currentSliders[s] = 0;
          }
          const overage = CountCohort() - FULLCOHORT;
          if (overage > 0) cohort[s] -= overage;
        }
      });

      cohortCount = CountCohort();

      loopFuse--;
      if (loopFuse < 0) {
        console.log('GAP:', gapToFill, cohortCount, currentSliders, cohort);
        throw new Error('FUSE');
      }
    } while (cohortCount < FULLCOHORT);

    if (cohortCount !== FULLCOHORT) throw new Error('INCORRECT COHORT SIZE');

    return cohort;
  };

  const GA = geneticAlgorithmConstructor<BattlePhenotype>({
    breath: SingletonCPUBreath,
    population: [RandomPhenotype()],
    // populationSize: 1000,
    mutationFunction: (p) => {
      if (Math.random() < 0.01) return RandomPhenotype();
      p.score = null;
      const randomRange = p.knownWinner ? 0.3 : 0.3;
      const randomSub = p.knownWinner ? 0.2 : 0.1;
      allSliders.forEach(
        (s) =>
          (p.sliders[s] =
            Math.random() < 0.1
              ? Math.random() < 0.5
                ? 1
                : 0
              : Math.random() < 0.6
              ? p.sliders[s]
              : Math.min(
                  1,
                  Math.max(
                    0,
                    p.sliders[s] + randomRange * Math.random() - randomSub
                  )
                ))
      );
      // console.log('Example mutant:', p, q);
      return p;
    },
    crossoverFunction: (a, b) => {
      a.score = null;
      b.score = null;
      allSliders.forEach((s) => {
        if (Math.random() < 0.2) {
          // SWAP
          const t = a.sliders[s];
          a.sliders[s] = b.sliders[s];
          b.sliders[s] = t;
        }
      });
      return [a, b];
    },
    fitnessFunction: async (p) => {
      if (p.score) return p.score;

      const cohort = SlidersToCohort(p.sliders, config.resources);
      const key = cohortToKey(cohort);
      if (cache[key] !== undefined) {
        // cachehit++;
        // console.log("We already computed this cohort before:",key,cachemiss,cachehit);
        return cache[key];
        // }else {
        // cachemiss++;
        // console.log("Cache miss",cachemiss,cachehit)
      }
      // cache[key] = true;
      delete cohort.nothing;

      // run the battle
      // const outcome = GetBattleOutcome({
      //   adversary: config.adversary,
      //   player: cohort,
      //   rounds: 1000,
      //   deterministic: false,
      // });
      if (SingletonCPUBreath === null) throw new Error('CANCELLED PROBABLY');
      const outcome = await GetBattleOutcome(
        {
          adversary: config.adversary,
          player: cohort,
          rounds: 50,
          deterministic: false,
        },
        SingletonCPUBreath
      );

      p.knownWinner = outcome.winRatio > 0.99;

      const score = BattleOutcomeToScore(outcome);

      cache[key] = score;

      // if (p.score !== null) {
      //   if (p.score === score) {
      //     console.log('SCORE ALREADY PRESENT');
      //   } else {
      //     console.log('BAD SCORE PRESENT', p.score, score);
      //   }
      // }
      p.score = score;

      return score;
    },
  });

  for (var i = 0; i < 100; i++) {
    await GA.evolve();

    console.log('START BEST');
    const startedAt = new Date().getTime();
    const best = await GA.best();

    const bestCohort = SlidersToCohort(best.sliders, config.resources);
    delete bestCohort.nothing;

    // const outcome = await GetBattleOutcome({
    //   adversary: config.adversary,
    //   player: bestCohort,
    //   rounds: 1000,
    //   deterministic: false,
    // });

    // Report upwards
    if (config.callback) config.callback(bestCohort);
  }

  // function mutationFunction(phenotype) {
  // 	// make a random change to phenotype
  //     	return phenotype
  // }

  // function crossoverFunction(phenotypeA, phenotypeB) {
  // 	// move, copy, or append some values from a to b and from b to a
  // 	return [ phenotypeA , phenotypeB ]
  // }

  // function fitnessFunction(phenotype) {
  // 	var score = 0
  // 	// use your phenotype data to figure out a fitness score
  // 	return score
  // }

  // var firstPhenotype = {
  // 	dummyKey : "dummyValue"
  // 	// enter phenotype data here
  // }

  // var geneticAlgorithmConstructor = require('../index')
  // var geneticAlgorithm = geneticAlgorithmConstructor({
  //     mutationFunction: mutationFunction,
  //     crossoverFunction: crossoverFunction,
  //     fitnessFunction: fitnessFunction,
  //     population: [ firstPhenotype ]
  // });

  // console.log("Starting with:")
  // console.log( firstPhenotype )
  // for( var i = 0 ; i < 100 ; i++ ) geneticAlgorithm.evolve()
  // var best = geneticAlgorithm.best()
  // delete best.score
  // console.log("Finished with:")
  // console.log(best)
}

function cohortToKey(cohort: BattleCohort) {
  return `${cohort.militia || 0}|${cohort.archer || 0}|${
    cohort.footsoldier || 0
  }|${cohort.cavalry || 0}|${cohort.longbow || 0}|${cohort.knight || 0}|${
    cohort.crossbow || 0
  }|${cohort.horse2 || 0}|${cohort.cannon || 0}`;
}

const TestBattleConfig: OptimiserConfig = {
  resources: {
    footsoldier: 100,
    cavalry: 136,
    // longbow: 48,
    knight: 100,
    crossbow: 200,
    // horse2: 7,
  },
  adversary: {
    vanguard: 37,
    demolisher: 9,
    // demolisher: 15,
  },
};

const TestSample1: OptimiserConfig = {
  // THIS IS WINNABLE: Knight 6, Crossbowman 56
  resources: {
    footsoldier: 100,
    cavalry: 136,
    // longbow: 48,
    knight: 100,
    crossbow: 200,
    // horse2: 7,
  },
  adversary: {
    vanguard: 37,
    demolisher: 9,
    // demolisher: 15,
  },
};

// const TestBattleConfig: OptimiserConfig = {
//   resources: {
//     knight: 100,
//     longbow: 48,
//     horse2: 55,
//   },
//   adversary: {
//     elitehunter: 84,
//     sniper: 10,
//   },
// };

// OptimiseForBattle(TestBattleConfig);
// OptimiseForBattle(TestSample1);

// MY SAMPLE BATTLE:
// THEIRS:
// 84 Elite Orc Hunter
// 10 Elite Orc Sniper
// OURS:
// 48 Longbow Archer
// 100 Knight
// 55 Cuirassier
// SELECTION:
// 48 Longbow Archer
// 1 Knight
// 48 Cuirassier

// score modifiers
// Real HP = HP that was actually smacked out of units to the last punch. Units will recover after the battle so if you got Mazoga's Real HP down to 100 you know it won't take much to finish them off.
// Retained HP = HP left over at the end of the battle, includes the healing effect. So you get an idea of how effective your battle was. If you don't win then at least you took a ton of them with you.

const SCOREMOD_WIN = 100000;
const SCOREMOD_PARTIAL_WIN = 2000;
const SCOREMOD_LOSE_ADVERSARY_REAL_HP = 1000;
const SCOREMOD_LOSE_ADVERSARY_RETAINED_HP = 10000;
const SCOREMOD_PLAYER_REAL_HP = 1000;
const SCOREMOD_PLAYER_RETAINED_HP = 4000;
const SCOREMOD_WIN_LESS_UNITS = 1000;
const SCOREMOD_LOSE_LESS_UNITS = 25;
const SCOREMOD_ADVERSARY_KILL_RATE = 2000;

export function BattleOutcomeToScoreElements(outcome: BattleOutcome) {
  // Our strategy:
  // WINNING is better than LOSING (10000 points for winning, or ratio thereof)
  // If it's a WIN optimise for:
  // - Reduced player unit count (1000 points)
  // - Shorter time (1000 points)
  // If it's a LOSE optimise for:
  // - Cheaper units dying (meat in the grinder) (3000 points)
  // - Maximum hp whacked (6000 points)

  // Player unit analysis
  let playerUnitCount = 0;
  Object.keys(outcome.setup.player).forEach((key) => {
    playerUnitCount += outcome.setup.player[key];
  });

  let adversaryUnitCount = 0;
  let adversaryKillCount = 0;
  Object.keys(outcome.adversary).forEach((key) => {
    adversaryUnitCount += outcome.setup.adversary[key];
    adversaryKillCount += outcome.adversary[key].dead_avg;
  });

  const playerRetainedHP = outcome.playerHP.retained / outcome.playerHP.total;
  const playerRealHP = outcome.playerHP.real / outcome.playerHP.total;
  const adversaryRetainedHP =
    outcome.adversaryHP.retained / outcome.adversaryHP.total;
  const adversaryRealHP = outcome.adversaryHP.real / outcome.adversaryHP.total;

  const unitEfficiency = (100 - playerUnitCount) / 100;

  const probableWin = outcome.winRatio > 0.96;

  const FullWin = outcome.winRatio > 0.96 ? SCOREMOD_WIN : 0;
  const PartialWin = SCOREMOD_PARTIAL_WIN * outcome.winRatio;

  // Player HP
  // score += SCOREMOD_PLAYER_REAL_HP * playerRealHP;
  // score += SCOREMOD_PLAYER_RETAINED_HP * playerRetainedHP;

  const AdversaryRealHP =
    SCOREMOD_LOSE_ADVERSARY_REAL_HP * (1 - adversaryRealHP);
  const AdversaryRetainedHP =
    SCOREMOD_LOSE_ADVERSARY_RETAINED_HP * (1 - adversaryRetainedHP);

  const AdversaryKillRate =
    (adversaryKillCount / adversaryUnitCount) * SCOREMOD_ADVERSARY_KILL_RATE;

  const UnitEfficiency =
    (probableWin ? SCOREMOD_WIN_LESS_UNITS : SCOREMOD_LOSE_LESS_UNITS) *
    unitEfficiency;

  const NoUnitFielding = playerUnitCount === 0 ? -10000000 : 0;

  const elements = {
    FullWin,
    PartialWin,
    AdversaryRealHP,
    AdversaryRetainedHP,
    AdversaryKillRate,
    UnitEfficiency,
    NoUnitFielding,
    score: 0,
  };

  let elementSum = 0;
  Object.values(elements).forEach((e) => (elementSum += e));
  elements.score = elementSum;

  return elements;
}

export function BattleOutcomeToScore(outcome: BattleOutcome) {
  // // Our strategy:
  // // WINNING is better than LOSING (10000 points for winning, or ratio thereof)
  // // If it's a WIN optimise for:
  // // - Reduced player unit count (1000 points)
  // // - Shorter time (1000 points)
  // // If it's a LOSE optimise for:
  // // - Cheaper units dying (meat in the grinder) (3000 points)
  // // - Maximum hp whacked (6000 points)

  // let score = 0;

  // // Player unit analysis
  // let playerUnitCount = 0;
  // Object.keys(outcome.setup.player).forEach((key) => {
  //   playerUnitCount += outcome.setup.player[key];
  // });

  // const playerRetainedHP = outcome.playerHP.retained / outcome.playerHP.total;
  // const playerRealHP = outcome.playerHP.real / outcome.playerHP.total;
  // const adversaryRetainedHP =
  //   outcome.adversaryHP.retained / outcome.adversaryHP.total;
  // const adversaryRealHP = outcome.adversaryHP.real / outcome.adversaryHP.total;

  // const unitEfficiency = (100 - playerUnitCount) / 100;

  // const probableWin = outcome.winRatio > 0.96;
  // const fullWin = outcome.winRatio > 0.96;

  // if (fullWin) score += SCOREMOD_WIN;
  // score += SCOREMOD_PARTIAL_WIN * outcome.winRatio;

  // // Player HP
  // // score += SCOREMOD_PLAYER_REAL_HP * playerRealHP;
  // // score += SCOREMOD_PLAYER_RETAINED_HP * playerRetainedHP;

  // score += SCOREMOD_LOSE_ADVERSARY_REAL_HP * (1 - adversaryRealHP);
  // score += SCOREMOD_LOSE_ADVERSARY_RETAINED_HP * (1 - adversaryRetainedHP);
  // score +=
  //   (probableWin ? SCOREMOD_WIN_LESS_UNITS : SCOREMOD_LOSE_LESS_UNITS) *
  //   unitEfficiency;

  //   if (playerUnitCount === 0) {
  //     // COME ON MAN DONT JUST FIELD NOTHING
  //     return -10000000;
  //   }

  // return score;

  const elem = BattleOutcomeToScoreElements(outcome);
  return elem.score;
}

// WEIRD CASES:
/*

Had 100 of everything except 0 footsoldier and cannon, 13 archers.
1 orc vetran + 71 e o sniper + mazoga, it had a fit and decideed to just quit.
Ideal match is 90 cavalry and 10 longbow

Orc Veteran 34
Elite Orc Hunter 93

100 each of Knight, Cavalry, Cuirasser, Longbow Archer, Crossbowman

Goes from almost certain defeat to almost certain victory over a few steps, interesting progression

*/
