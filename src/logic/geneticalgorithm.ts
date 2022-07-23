// https://github.com/panchishin/geneticalgorithm
// Just added typescript

import { CpuBreatherCheck, CpuBreatherData, CpuBreatherStart } from './utils';

type MutationFunction<PHENOTYPE> = (phenotype: PHENOTYPE) => PHENOTYPE;
type CrossoverFunction<PHENOTYPE> = (a: PHENOTYPE, b: PHENOTYPE) => PHENOTYPE[];
type FitnessFunction<PHENOTYPE> = (phenotype: PHENOTYPE) => Promise<number>;
type DoesABeatBFunction<PHENOTYPE> = (a: PHENOTYPE, b: PHENOTYPE) => boolean;

export type GACSettings<PHENOTYPE> = {
  mutationFunction: MutationFunction<PHENOTYPE>;
  crossoverFunction: CrossoverFunction<PHENOTYPE>;
  fitnessFunction: FitnessFunction<PHENOTYPE>;
  doesABeatBFunction?: DoesABeatBFunction<PHENOTYPE>;
  population: PHENOTYPE[];
  populationSize: number;
  breath: CpuBreatherData;
};

export function geneticAlgorithmConstructor<PHENOTYPE>(
  options: Partial<GACSettings<PHENOTYPE>>
) {
  function settingDefaults(): GACSettings<PHENOTYPE> {
    return {
      mutationFunction: function (phenotype) {
        return phenotype;
      },

      crossoverFunction: function (a, b) {
        return [a, b];
      },

      fitnessFunction: async function (phenotype) {
        return 0;
      },

      doesABeatBFunction: undefined,

      population: [],
      populationSize: 100,
      breath: CpuBreatherStart(),
    };
  }

  function settingWithDefaults(
    settings: Partial<GACSettings<PHENOTYPE>> | undefined,
    defaults: GACSettings<PHENOTYPE>
  ) {
    const result: GACSettings<PHENOTYPE> = {
      ...defaults,
      ...settings,
    };

    // Spread function says roll over old way of doing things
    // settings = settings || {}

    // settings.mutationFunction = settings.mutationFunction || defaults.mutationFunction
    // settings.crossoverFunction = settings.crossoverFunction || defaults.crossoverFunction
    // settings.fitnessFunction = settings.fitnessFunction || defaults.fitnessFunction

    // settings.doesABeatBFunction = settings.doesABeatBFunction || defaults.doesABeatBFunction

    // settings.population = settings.population || defaults.population
    if (result.population.length <= 0)
      throw Error(
        'population must be an array and contain at least 1 phenotypes'
      );

    // settings.populationSize = settings.populationSize || defaults.populationSize
    if (result.populationSize <= 0)
      throw Error('populationSize must be greater than 0');

    return result;
  }

  var settings = settingWithDefaults(options, settingDefaults());

  function populate() {
    var size = settings.population.length;
    while (settings.population.length < settings.populationSize) {
      settings.population.push(
        mutate(cloneJSON(settings.population[Math.floor(Math.random() * size)]))
      );
    }
  }

  function cloneJSON<WHATEVER>(object: WHATEVER): WHATEVER {
    return JSON.parse(JSON.stringify(object));
  }

  function mutate(phenotype: PHENOTYPE) {
    return settings.mutationFunction(cloneJSON(phenotype));
  }

  function crossover(phenotype: PHENOTYPE) {
    phenotype = cloneJSON(phenotype);
    var mate =
      settings.population[
        Math.floor(Math.random() * settings.population.length)
      ];
    mate = cloneJSON(mate);
    return settings.crossoverFunction(phenotype, mate)[0];
  }

  async function doesABeatB(a: PHENOTYPE, b: PHENOTYPE) {
    if (settings.doesABeatBFunction) {
      return settings.doesABeatBFunction(a, b);
    } else {
      return (
        (await settings.fitnessFunction(a)) >=
        (await settings.fitnessFunction(b))
      );
    }
  }

  async function compete() {
    var nextGeneration = [];

    for (var p = 0; p < settings.population.length - 1; p += 2) {
      var phenotype = settings.population[p];
      var competitor = settings.population[p + 1];

      nextGeneration.push(phenotype);
      if (await doesABeatB(phenotype, competitor)) {
        if (Math.random() < 0.5) {
          nextGeneration.push(mutate(phenotype));
        } else {
          nextGeneration.push(crossover(phenotype));
        }
      } else {
        nextGeneration.push(competitor);
      }

      await CpuBreatherCheck(settings.breath);
    }

    settings.population = nextGeneration;
  }

  function randomizePopulationOrder() {
    for (var index = 0; index < settings.population.length; index++) {
      var otherIndex = Math.floor(Math.random() * settings.population.length);
      var temp = settings.population[otherIndex];
      settings.population[otherIndex] = settings.population[index];
      settings.population[index] = temp;
    }
  }

  return {
    evolve: async function (options?: Partial<GACSettings<PHENOTYPE>>) {
      if (options) {
        settings = settingWithDefaults(options, settings);
      }

      populate();
      randomizePopulationOrder();
      await compete();
      return this;
    },
    best: async function () {
      var scored = await this.scoredPopulation();
      var result = scored.reduce(function (a, b) {
        return a.score >= b.score ? a : b;
      }, scored[0]).phenotype;
      return cloneJSON(result);
    },
    bestScore: async function () {
      return await settings.fitnessFunction(await this.best());
    },
    population: function () {
      return cloneJSON(this.config().population);
    },
    scoredPopulation: async function () {
      const output: { phenotype: PHENOTYPE; score: number }[] = [];
      const pop = this.population();
      for (let n = 0; n < pop.length; n++) {
        const phenotype = pop[n];
        output.push({
          phenotype: cloneJSON(phenotype),
          score: await settings.fitnessFunction(phenotype),
        });
      }
      return output;
      // return this.population().map(function (phenotype) {
      //   return {
      //     phenotype: cloneJSON(phenotype),
      //     score: await settings.fitnessFunction(phenotype),
      //   };
      // });
    },
    config: function () {
      return cloneJSON(settings);
    },
    clone: function (options?: Partial<GACSettings<PHENOTYPE>>) {
      return geneticAlgorithmConstructor(
        settingWithDefaults(
          options,
          settingWithDefaults(this.config(), settings)
        )
      );
    },
  };
}
