import { BattleBar } from './BattleBar';

type VictoryOrDefeatProps = {
  winRatio: number;
  properBattle: boolean;
};

export function VictoryOrDefeat({
  winRatio,
  properBattle,
}: VictoryOrDefeatProps) {
  const palette = !properBattle
    ? 'grey'
    : winRatio >= 0.5
    ? 'victory'
    : 'defeat';

  const augmentPosition = winRatio < 0.5 ? 1 - winRatio : winRatio;
  const augmentionWord = !properBattle
    ? ''
    : augmentPosition > 0.999
    ? 'Definite'
    : augmentPosition > 0.8
    ? 'Almost Certain'
    : augmentPosition > 0.6
    ? 'Probably'
    : 'Possible';

  const outcomeMajor = !properBattle
    ? ''
    : winRatio >= 0.5
    ? 'Victory'
    : 'Defeat';
  return (
    <div className={'flex-grow p-1 bg-' + palette + '_dark rounded-xl'}>
      <div
        className={`rounded-xl p-2 bg-${palette} border-t-8 border-b-8 border-t-${palette}_high border-b-${palette}_low flex flex-col place-content-center`}
      >
        <span
          className={
            'text-white text-center font-extrabold shadow-victory_shadow drop-shadow-xl'
          }
        >
          {augmentionWord}
        </span>
        <span
          className={
            'text-white  text-center text-3xl font-extrabold shadow-' +
            palette +
            '_shadow drop-shadow-xl'
          }
        >
          {outcomeMajor}
        </span>
        <div className="bg-white p-0.5 rounded mt-2">
          <BattleBar
            ratioAliveMax={winRatio}
            ratioAliveMin={winRatio}
            label={`Chance of Win: ${~~(winRatio * 1000) / 10}%`}
          />
        </div>
        {/* This has to be here for tailwind to include our class variations */}
        <div className="bg-victory bg-defeat border-t-victory_high border-b-victory_low bg-victory_dark bg-victory_shadow  border-t-defeat_high border-b-defeat_low bg-defeat_dark bg-defeat_shadow"></div>
      </div>
    </div>
  );
}
