export function Instructions() {
  return (
    <div className="items-center justify-center place-content-center flex flex-row p-4 pb-12">
      <div className="bg-white pl-8 max-w-3xl border-l-8">
        <div className="bg-white p-8 max-w-3xl border-l-2 border-l-red-200">
          <Title>Instructions</Title>
          <P>
            "Pay no attention to Lord Southburgh hacking away on his M2 MacBook
            Air as he sits on the floor of the Kontor. That's not me. Ignore him
            as he sits behind the curtain on a pile of React books on permanent
            loan from the university and cussing like a sailor."
          </P>
          <H1>What is this thing?</H1>
          <P>
            The battle computer helps you plan your attacks. You can manually
            choose your Attack Force or you can tell the computer what you have
            available in the Garrison and let it calculate what it thinks is the
            best force.
          </P>
          <H1>Basic use</H1>
          <OL>
            <LI>Get the battle screen up in Paragon Pioneers</LI>
            <LI>
              Copy the Enemy Camp into the Battle Computer's left hand side. You
              can use the buttons or type with the keyboard.
            </LI>
            <LI>
              Choose your Attack Force in the Attack Force box. It's directly to
              the right of the Battlefield. Again, use the buttons or keyboard.
            </LI>
            <LI>
              The battle outcome shows up straight away in the Battlefield. This
              lets you make adjustments to your force to get the perfect victory
              (or defeat)
            </LI>
          </OL>
          <H1>How to Automatically pick your Attack Force</H1>
          <P>
            You tell the Battle Computer what you have to work with, and it will
            plan the best Attack Force for you.
          </P>
          <P>
            It's a bit flaky at the moment, hopefully I'll find some time to
            improve it.
          </P>
          <OL>
            <LI>
              First, put the Units you have available into the Garrison box on
              the far right. You can copy it from your island's Garrison screen,
              or whatever's available on the Battle Preparation screen. I
              usually just punch in 100 if there's more than that.
            </LI>
            <LI>Copy the Enemy Camp into the left side, same as basic use.</LI>
            <LI>Click "Start Automatic Battle Plan".</LI>
            <LI>
              The Battlefield will flicker with Attack Force choices that the
              Computer thinks are good. It will continually improve them for a
              while.
            </LI>
            <LI>
              At the moment it doesn't tell you when it's done. I'll make it
              better, but to force it to stop just reload the page for now.
            </LI>
            <LI>
              Once it's stopped moving you can adjust your Attack Force if you
              like. The Computer has a habit to uhhh... send everyone to their
              deaths, you might find if you add more troops you won't kill
              everyone.
            </LI>
            <LI>Punch it in to the game and wait for the outcome!</LI>
          </OL>
          <H1>Some technical stuff about AutoForce</H1>
          <P>
            This is a genetic algorithm. I always wanted to try making one of
            these and it came out peachy. It tries combinations semi-randomly,
            picks the best ones, then breeds them to make possible improvements.
          </P>
          <P>
            The algorithm prefers wins at all costs. If it can't win it tries to
            do lasting damage to the enemy. Like I said, it's a bit of a meat
            grinder because it will send just enough units to win, without
            worrying about its own HP. I had empathy in before but it had mixed
            results. I'll sort it one day.
          </P>
          <H1>Future Stuff</H1>
          <P>
            I have no idea if I will ever get around to doing any of the
            following:
          </P>
          <OL>
            <LI>
              Empathy in the Calculator, stop killing our troops! Also some cost
              weightings so that more expensive units are spared a bit.
            </LI>
            <LI>Make it more prettier</LI>
            <LI>
              Sliders to set your preferred priorities for the AutoForce
              Calculator
            </LI>
            <LI>
              Import your save file and just let you lazily select the battles
              available, murdering your troops at arms length
            </LI>
          </OL>
          <P>Feel free to fork on GitHub or send in PR's.</P>
          <H1>Privacy and Feedback</H1>
          <P>
            If you want to feedback then please submit an issue to this project
            on GitHub.
          </P>
          <P>
            I put Google Analytics on this page just because I want to know if
            people are finding it useful. Some people hate Google but if that's
            you then you probably already block it. The data won't be going
            anywhere else besides me looking at it over a Schnapps.
          </P>
        </div>
      </div>
    </div>
  );
}

type TitleProps = {
  children: React.ReactNode;
};

function Title({ children }: TitleProps) {
  return (
    <h1 className="text-center border-defeat_dark border-b-2 mb-6">
      {children}
    </h1>
  );
}

type H1Props = {
  children: React.ReactNode;
};

function H1({ children }: H1Props) {
  return <h1 className="pb-3 pt-3">{children}</h1>;
}

type PProps = {
  children: React.ReactNode;
};

function P({ children }: PProps) {
  return <p className="text-gray-600 pb-3 pl-6">{children}</p>;
}

type OLProps = {
  children: React.ReactNode;
};

function OL({ children }: OLProps) {
  return <ol className="list-decimal pl-10 text-gray-600">{children}</ol>;
}

type LIProps = {
  children: React.ReactNode;
};

function LI({ children }: LIProps) {
  return <li className="pb-2">{children}</li>;
}
