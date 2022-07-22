export type SkillSet = {
  reach?: boolean;
  double?: boolean;
  flanking?: boolean;
  last?: boolean;
  first?: boolean;
  trample?: boolean;
};

export type UnitDef = {
  name: string;
  player?: boolean;
  hp: number;
  attack: number;
  crit: number;
  order: number;
  tier: number;
  // cost: number;
  // merc_cost: number;
  skills: SkillSet;
  unitURL: string;
  weaponURL: string;
};

export type UnitTypes =
  | 'militia'
  | 'archer'
  | 'footsoldier'
  | 'cavalry'
  | 'longbow'
  | 'knight'
  | 'crossbow'
  | 'horse2'
  | 'cannon'
  | 'orkling'
  | 'hunter'
  | 'raider'
  | 'elitehunter'
  | 'veteran'
  | 'sniper'
  | 'warg'
  | 'vanguard'
  | 'demolisher'
  | 'boss1'
  | 'boss2'
  | 'boss3'
  | 'boss4';

export const UnitDefs: { [k in UnitTypes]: UnitDef } = {
  militia: {
    name: 'Militia',
    player: true,
    hp: 15,
    attack: 5,
    crit: 0.8,
    order: 0,
    tier: 1,
    skills: {},
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/e/e7/Militia.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/1/1c/Pitchfork.png',
  },
  archer: {
    name: 'Archer',
    player: true,
    hp: 10,
    attack: 20,
    crit: 0.8,
    order: 5,
    tier: 1,
    skills: { reach: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/2/29/Archer.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/6/65/Bow.png',
  },
  footsoldier: {
    name: 'Footsoldier',
    player: true,
    hp: 40,
    attack: 15,
    crit: 0.8,
    order: 1,
    tier: 1,
    skills: {},
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/5/5e/Recruit.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/b/b9/Copper_sword.png',
  },
  longbow: {
    name: 'Longbow Archer',
    player: true,
    hp: 10,
    attack: 15,
    crit: 0.8,
    order: 6,
    tier: 2,
    skills: { reach: true, double: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/e/ea/Longbow_archer.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/e/e4/Longbow.png',
  },
  knight: {
    name: 'Knight',
    player: true,
    hp: 90,
    attack: 20,
    crit: 0.8,
    order: 2,
    tier: 3,
    skills: {},
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/6/6b/Knight.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/3/3c/Iron_sword.png',
  },
  crossbow: {
    name: 'Crossbowman',
    player: true,
    hp: 15,
    attack: 90,
    crit: 0.8,
    order: 7,
    tier: 3,
    skills: { reach: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/c/c5/Crossbow_archer.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/7/79/Crossbow.png',
  },
  cavalry: {
    name: 'Cavalry',
    player: true,
    hp: 5,
    attack: 5,
    crit: 0.8,
    order: 4,
    tier: 2,
    skills: { flanking: true, first: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/1/15/Cavalry.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/c/c3/Horse.png',
  },
  horse2: {
    name: 'Cuirassier',
    player: true,
    hp: 120,
    attack: 10,
    crit: 0.8,
    order: 3,
    tier: 4,
    skills: { first: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/f/ff/Cuirassier.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/c/ce/Armored_horse.png',
  },
  cannon: {
    name: 'Cannoneer',
    player: true,
    hp: 60,
    attack: 80,
    crit: 0.8,
    order: 8,
    tier: 4,
    skills: { reach: true, trample: true, flanking: true, last: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/c/cd/Cannonneer.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/a/a6/Cannon.png',
  },
  orkling: {
    name: 'Orkling',
    hp: 15,
    attack: 5,
    crit: 0.6,
    order: 0,
    tier: 1,
    skills: {},
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/2/25/Orcling.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/5/50/Club.png',
  },
  hunter: {
    name: 'Orc Hunter',
    hp: 10,
    attack: 20,
    crit: 0.6,
    order: 5,
    tier: 1,
    skills: { reach: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/1/14/Orc_1.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/6/65/Bow.png',
  },
  raider: {
    name: 'Orc Raiders',
    hp: 40,
    attack: 15,
    crit: 0.6,
    order: 1,
    tier: 1,
    skills: {},
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/1/14/Orc_1.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/b/b9/Copper_sword.png',
  },
  elitehunter: {
    name: 'Elite Orc Hunters',
    hp: 10,
    attack: 15,
    crit: 0.6,
    order: 6,
    tier: 2,
    skills: { reach: true, double: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/2/2d/Orc_2.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/e/e4/Longbow.png',
  },
  veteran: {
    name: 'Orc Veteran',
    hp: 90,
    attack: 20,
    crit: 0.6,
    order: 2,
    tier: 3,
    skills: {},
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/a/ab/Orc_3.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/3/3c/Iron_sword.png',
  },
  sniper: {
    name: 'Elite Orc Sniper',
    hp: 15,
    attack: 90,
    crit: 0.6,
    order: 7,
    tier: 3,
    skills: { reach: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/a/ab/Orc_3.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/7/79/Crossbow.png',
  },
  warg: {
    name: 'Warg Rider',
    hp: 5,
    attack: 5,
    crit: 0.6,
    order: 4,
    tier: 2,
    skills: { flanking: true, first: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/2/2d/Orc_2.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/c/c3/Horse.png',
  },
  vanguard: {
    name: 'Orc Vanguard',
    hp: 120,
    attack: 10,
    crit: 0.6,
    order: 3,
    tier: 4,
    skills: { first: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/c/ce/Orc_4.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/c/ce/Armored_horse.png',
  },
  demolisher: {
    name: 'Orc Demolisher',
    hp: 60,
    attack: 80,
    crit: 0.6,
    order: 8,
    tier: 4,
    skills: { reach: true, trample: true, flanking: true, last: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/c/ce/Orc_4.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/a/a6/Cannon.png',
  },
  boss1: {
    name: 'Bula (boss 1)',
    hp: 5000,
    attack: 150,
    crit: 0.5,
    order: 100,
    tier: 100,
    skills: { trample: true, last: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/f/ff/Orc_boss_1.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/d/df/Wood.png',
  },
  boss2: {
    name: 'Aguk (boss 2)',
    hp: 11000,
    attack: 300,
    crit: 0.5,
    order: 100,
    tier: 150,
    skills: { trample: true, last: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/a/a9/Orc_boss_2.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/b/b9/Copper_sword.png',
  },
  boss3: {
    name: 'Mazoga (boss 3)',
    hp: 120000,
    attack: 100,
    crit: 0.5,
    order: 3.5,
    tier: 200,
    skills: { trample: true, last: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/b/b5/Orc_boss_3.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/3/3c/Iron_sword.png',
  },
  boss4: {
    name: 'Durgash (boss 4)',
    hp: 40000,
    attack: 500,
    crit: 0.5,
    order: 100,
    tier: 300,
    skills: { trample: true, first: true },
    unitURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/9/9c/Orc_boss_4.png',
    weaponURL:
      'https://static.wikia.nocookie.net/paragonpioneers/images/a/a6/Cannon.png',
  },
};

export type ComputedUnitDef = UnitDef & {
  max: number;
  type: string;
};

export const units_info: { [k: string]: ComputedUnitDef } = {} as any;

function ComputeUnitInfo() {
  for (const x in UnitDefs) {
    const def = UnitDefs[x as UnitTypes];
    units_info[x] = {
      ...def,
      max: def.hp,
      type: x,
    };
  }
}
ComputeUnitInfo();

export const AdversaryDisplayOrder: UnitTypes[] = [
  // Hitters
  'orkling',
  'raider',
  'veteran',
  // Horsers
  'warg',
  'vanguard',

  // Shooters
  'hunter',
  'elitehunter',
  'sniper',
  'demolisher',
  // Bossers
  'boss1',
  'boss2',
  'boss3',
  'boss4',
];

export const HeroDisplayOrder: UnitTypes[] = [
  'militia',
  'footsoldier',
  'knight',
  'cavalry',
  'horse2',
  'archer',
  'longbow',
  'crossbow',
  'cannon',
];
