import {
  ComputedUnitDef,
  SkillSet,
  UnitDef,
  units_info,
  UnitTypes,
} from './unitdefs';
import { CpuBreatherCheck, CpuBreatherStart } from './utils';

// type Forces = { [k in UnitTypes]: number };
export type BattleCohort = { [k: string]: number };
type UnitArray = ComputedUnitDef[];

const get_units = (forces: BattleCohort) => {
  let units: UnitArray = [];
  Object.keys(forces).forEach((u) => {
    for (let i = 0; i < forces[u]; i++) units.push({ ...units_info[u] });
  });
  units.sort((a, b) => a.order - b.order);
  units.forEach((u) => (u.max = u.hp));
  return units;
};

let find_weakest_target = (arr: UnitArray) =>
  arr.reduce<ComputedUnitDef>((p, c) => {
    if (c.hp <= 0) return p;
    if (p == null) return c;
    if (c.max <= p.max) return c;
    return p;
  }, null as any);
const find_target = (arr: UnitArray) => arr.find((a) => a.hp > 0);

const damage = (arr: UnitArray, amount: number, skills: SkillSet) => {
  let target = find_target;
  if (skills.flanking) {
    target = find_weakest_target;
  }
  do {
    let t = target(arr);
    if (t == null) break;
    if (amount < t.hp) {
      t.hp -= amount;
      amount = 0;
    }
    let tmp = t.hp;
    t.hp -= amount;
    amount -= tmp;
  } while (amount > 0 && skills.trample);
};

// Shuffles 0, 1, 2, ... 9 into 0, 9, 1, 8, ...
const shuffle = (n: number, max: number) => {
  if (n % 2 === 0) {
    return n / 2;
  } else {
    return max - (n - 1) / 2;
  }
};

const remove_dead = (arr: UnitArray) => arr.filter((a) => a.hp > 0);

const resolve_combat = (
  units_mine: UnitArray,
  units_theirs: UnitArray,
  deterministic_crits: boolean
) => {
  let crit_counter = 0;

  const critical = (chance: number, deterministic_crits: boolean) => {
    if (deterministic_crits) {
      if (chance === 1) return true;
      if (chance === 0) return false;

      crit_counter++;
      return shuffle(crit_counter % 10, 9) < chance * 10;
      // return crit_counter % 10 < chance * 10;
    } else {
      return Math.random() < chance;
    }
  };

  const attack = (
    a: ComputedUnitDef[],
    b: UnitArray,
    deterministic_crits: boolean
  ) => {
    a.forEach((unit) => {
      let dmg = unit.attack;
      if (critical(unit.crit, deterministic_crits)) dmg *= 2;
      damage(b, dmg, unit.skills);
    });
  };

  while (true) {
    {
      let first_a = units_mine.filter((a) => a.skills.first || a.skills.double);
      let first_b = units_theirs.filter(
        (a) => a.skills.first || a.skills.double
      ); // console.log(first_a, first_b);
      attack(first_a, units_theirs, deterministic_crits);
      attack(first_b, units_mine, deterministic_crits); // console.log(units_mine, units_theirs);
      units_mine = remove_dead(units_mine);
      units_theirs = remove_dead(units_theirs);
      if (units_mine.length == 0 || units_theirs.length == 0) break;
    } // console.log(units_mine, units_theirs);
    {
      let first_a = units_mine.filter(
        (a) => !(a.skills.first || a.skills.double || a.skills.last)
      );
      let first_b = units_theirs.filter(
        (a) => !(a.skills.first || a.skills.double || a.skills.last)
      );
      attack(first_a, units_theirs, deterministic_crits);
      attack(first_b, units_mine, deterministic_crits);
      units_mine = remove_dead(units_mine);
      units_theirs = remove_dead(units_theirs);
      if (units_mine.length == 0 || units_theirs.length == 0) break;
    }
    {
      let first_a = units_mine.filter((a) => a.skills.last || a.skills.double);
      let first_b = units_theirs.filter(
        (a) => a.skills.last || a.skills.double
      );
      attack(first_a, units_theirs, deterministic_crits);
      attack(first_b, units_mine, deterministic_crits);
      units_mine = remove_dead(units_mine);
      units_theirs = remove_dead(units_theirs);
      if (units_mine.length == 0 || units_theirs.length == 0) break;
    }
  }
  return [units_mine, units_theirs];
};

export async function doBattle(
  forces_mine: BattleCohort,
  forces_theirs: BattleCohort,
  rounds: number,
  deterministic = false
) {
  const breath = CpuBreatherStart();

  Object.keys(units_info).forEach((u) => {
    if (forces_mine[u] == 0) delete forces_mine[u];
    if (forces_theirs[u] == 0) delete forces_theirs[u];
  });
  // let losses = [];
  let wins = 0;
  let draws = 0;
  let roundsPlayed = 0;
  const playerOutcome: CohortOutcome = {};
  const adversaryOutcome: CohortOutcome = {};

  Object.keys(forces_mine).forEach(
    (key) =>
      (playerOutcome[key] = {
        dead_avg: 0,
        dead_max: -99999,
        dead_min: 99999,
        real_hp: 0,
        full_hp: forces_mine[key] * units_info[key].hp,
        retained_hp: 0,
        start_count: forces_mine[key],
        hp_each: units_info[key].hp,
      })
  );

  Object.keys(forces_theirs).forEach(
    (key) =>
      (adversaryOutcome[key] = {
        dead_avg: 0,
        dead_max: -99999,
        dead_min: 99999,
        real_hp: 0,
        full_hp: forces_theirs[key] * units_info[key].hp,
        retained_hp: 0,
        start_count: forces_theirs[key],
        hp_each: units_info[key].hp,
      })
  );

  for (let i = 0; i < rounds; i++) {
    let units_mine = get_units(forces_mine);
    let units_theirs = get_units(forces_theirs);
    [units_mine, units_theirs] = resolve_combat(
      units_mine,
      units_theirs,
      deterministic
    );

    if (units_theirs.length == 0) {
      wins++;
      if (units_mine.length == 0) draws++;
    }
    let rem_m = { ...forces_mine };
    let rem_t = { ...forces_theirs };
    let loss_m = { ...forces_mine };
    let loss_t = { ...forces_theirs };
    units_mine.forEach((u) => loss_m[u.type]--);
    units_theirs.forEach((u) => loss_t[u.type]--);

    units_mine.forEach((u) => (playerOutcome[u.type].real_hp += u.hp));
    units_theirs.forEach((u) => (adversaryOutcome[u.type].real_hp += u.hp));

    Object.keys(rem_m).forEach((u) => (rem_m[u] = forces_mine[u] - loss_m[u]));
    Object.keys(rem_t).forEach(
      (u) => (rem_t[u] = forces_theirs[u] - loss_t[u])
    );
    // losses.push([loss_m, loss_t]); // console.log(loss_m, loss_t);  // console.log(units_theirs.length, rem_m, forces_mine, loss_m);  // throw ''

    Object.keys(loss_m).forEach((key) => {
      const amt = loss_m[key];
      const ent = playerOutcome[key];
      ent.dead_avg += amt;
      if (amt > ent.dead_max) ent.dead_max = amt;
      if (amt < ent.dead_min) ent.dead_min = amt;
    });

    Object.keys(loss_t).forEach((key) => {
      const amt = loss_t[key];
      const ent = adversaryOutcome[key];
      ent.dead_avg += amt;
      if (amt > ent.dead_max) ent.dead_max = amt;
      if (amt < ent.dead_min) ent.dead_min = amt;
    });

    roundsPlayed++;
    await CpuBreatherCheck(breath);
  }

  Object.values(playerOutcome).forEach((e) => {
    e.dead_avg /= roundsPlayed;
    e.real_hp /= roundsPlayed;
    e.retained_hp = (e.start_count - e.dead_avg) * e.hp_each;
  });
  Object.values(adversaryOutcome).forEach((e) => {
    e.dead_avg /= roundsPlayed;
    e.real_hp /= roundsPlayed;
    e.retained_hp = (e.start_count - e.dead_avg) * e.hp_each;
  });

  // console.log('AND THE OUTCOME IS:');
  // console.log(losses);
  // console.log(wins);
  // console.log(draws);

  const battleTime = battle_time(forces_mine, forces_theirs, false);
  const battleTimeStr = format_seconds(battleTime);

  return {
    playerOutcome,
    adversaryOutcome,
    wins,
    draws,
    roundsPlayed,
    battleTime,
    battleTimeStr,
  };

  // let avg = (arr: Forces) => {
  //   let keys = Object.keys(arr[0]);
  //   let avg = {};
  //   keys.forEach((k) => {
  //     avg[k] = arr.reduce<number>((p, c) => p + c[k], 0) / arr.length;
  //   });
  //   return avg;
  // };
  // let min = (arr) => {
  //   let keys = Object.keys(arr[0]);
  //   let min = {};
  //   keys.forEach((k) => {
  //     min[k] = arr.reduce((p, c) => (p < c[k] ? p : c[k]), 99999999);
  //   });
  //   return min;
  // };
  // let max = (arr) => {
  //   let keys = Object.keys(arr[0]);
  //   let max = {};
  //   keys.forEach((k) => {
  //     max[k] = arr.reduce((p, c) => (p > c[k] ? p : c[k]), 0);
  //   });
  //   return max;
  // };
  // console.log((100 * wins) / rounds, (100 * draws) / rounds);
  // console.log(avg(losses.map((a) => a[0])));
  // console.log(avg(losses.map((a) => a[1])));
  // const what = losses.map((a) => a[0]);
  // let loss_m = [
  //   avg(losses.map((a) => a[0])),
  //   min(losses.map((a) => a[0])),
  //   max(losses.map((a) => a[0])),
  // ];
  // let loss_t = [
  //   avg(losses.map((a) => a[1])),
  //   min(losses.map((a) => a[1])),
  //   max(losses.map((a) => a[1])),
  // ];
  // let btime = format_seconds(battle_time(forces_mine, forces_theirs, false));
  // console.log(loss_m);
  // let text = `Results:
  // Wins: ${decimal((100 * wins) / rounds)}%
  // Draws: ${decimal((100 * draws) / rounds)}%
  // Losses: ${decimal(100 - (100 * wins) / rounds)}%
  // Expected losses (you): ${Object.keys(loss_m[0])
  //   .map(
  //     (a) =>
  //       `${units_info[a].name ?? a}: ${decimal(loss_m[0][a])}${
  //         loss_m[1][a] != loss_m[2][a]
  //           ? ' (' + loss_m[1][a] + '-' + loss_m[2][a] + ')'
  //           : ''
  //       }`
  //   )
  //   .join(' ')}
  //   Expected losses (orcs): ${Object.keys(loss_t[0])
  //     .map(
  //       (a) =>
  //         `${units_info[a].name ?? a}: ${decimal(loss_t[0][a])}${
  //           loss_t[1][a] != loss_t[2][a]
  //             ? ' (' + loss_t[1][a] + '-' + loss_t[2][a] + ')'
  //             : ''
  //         }`
  //     )
  //     .join(' ')}
  // Battle time: ${btime}`;
  // document.getElementById('results').innerText = text;
}

// Calculate battle time in seconds
const battle_time = (
  forces_mine: BattleCohort,
  forces_theirs: BattleCohort,
  perk: boolean
) => {
  let tier_sum = Object.keys(forces_mine).reduce(
    (p, c) => p + forces_mine[c] * units_info[c].tier,
    0
  );
  tier_sum += Object.keys(forces_theirs).reduce(
    (p, c) => p + forces_theirs[c] * units_info[c].tier,
    0
  );
  let result = Math.round(Math.pow(tier_sum * 2, 1.4));
  if (perk) result = Math.max(0, result - 2 * 60 * 60) / 2;
  return Math.min(result, 8 * 60 * 60);
};

const format_seconds = (seconds: number) => {
  let out_seconds = seconds % 60;
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return (
    (hours > 0 ? hours + 'h ' : '') +
    (minutes > 0 ? minutes + 'm ' : '') +
    (out_seconds > 0 ? out_seconds + 's ' : '')
  );
};

const decimal = (v: number) => Math.round(v * 100) / 100;

export type BattleSetup = {
  player: BattleCohort;
  adversary: BattleCohort;
  rounds: number;
  deterministic: boolean;
};

export type BattleUnitOutcome = {
  dead_min: number;
  dead_max: number;
  dead_avg: number;
  hp_each: number;
  real_hp: number;
  full_hp: number;
  retained_hp: number;
  start_count: number;
};

export type CohortOutcome = { [key: string]: BattleUnitOutcome };

type HPData = {
  total: number;
  real: number;
  retained: number;
};

export type BattleOutcome = {
  winRatio: number;
  player: CohortOutcome;
  adversary: CohortOutcome;
  setup: BattleSetup;
  playerHP: HPData;
  adversaryHP: HPData;
  battleTime: number;
  battleTimeStr: string;
};

export async function GetBattleOutcome(setup: BattleSetup) {
  const dbResult = await doBattle(
    { ...setup.player },
    { ...setup.adversary },
    setup.rounds,
    setup.deterministic
  );

  const playerHP: HPData = {
    real: 0,
    retained: 0,
    total: 0,
  };
  Object.keys(dbResult.playerOutcome).forEach((k) => {
    playerHP.total += dbResult.playerOutcome[k].full_hp;
    playerHP.real += dbResult.playerOutcome[k].real_hp;
    playerHP.retained += dbResult.playerOutcome[k].retained_hp;
  });

  const adversaryHP: HPData = {
    real: 0,
    retained: 0,
    total: 0,
  };
  Object.keys(dbResult.adversaryOutcome).forEach((k) => {
    adversaryHP.total += dbResult.adversaryOutcome[k].full_hp;
    adversaryHP.real += dbResult.adversaryOutcome[k].real_hp;
    adversaryHP.retained += dbResult.adversaryOutcome[k].retained_hp;
  });

  const outcome: BattleOutcome = {
    winRatio: dbResult.wins / dbResult.roundsPlayed,
    player: dbResult.playerOutcome,
    adversary: dbResult.adversaryOutcome,
    setup,
    playerHP,
    adversaryHP,
    battleTime: dbResult.battleTime,
    battleTimeStr: dbResult.battleTimeStr,
  };

  return outcome;
}
