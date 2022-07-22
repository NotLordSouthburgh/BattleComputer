import meat from '../asset/meat.png';

export function Footer() {
  return (
    <div>
      <div className="flex flex-row items-center">
        <div></div>
        <div className="h-36 shrink-0 mr-2">
          <img
            className="h-36 w-36 top-0 left-0"
            src={meat}
            alt="Not Lord Southburgh"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{`powered by M>E>A>T`}</h1>
          <span>
            Thanks to the Battle Calculators I used as a base -&nbsp;
            <a
              className="App-link"
              href="https://parpio-battle.github.io/parpio-battle/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ParPio-Battle /&nbsp;
            </a>
            <a
              className="App-link"
              href="https://galefury.github.io/parpio-battle/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Galefury /&nbsp;
            </a>
            <a
              className="App-link"
              href="https://andyhazz.github.io/parpio-battle/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Andy Hazz
            </a>
          </span>
          <span>
            Fork me on&nbsp;
            <a
              className="App-link"
              href="https://github.com/NotLordSouthburgh/PPBattleComputer"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
