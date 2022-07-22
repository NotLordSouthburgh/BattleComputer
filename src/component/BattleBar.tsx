import React, { useState } from 'react';

type BattleBarProps = {
  ratioAliveMax: number;
  ratioAliveMin: number;
};

export function BattleBar({ ratioAliveMax, ratioAliveMin }: BattleBarProps) {
  return (
    <div className="w-full bg-red-700 h-4 rounded">
      <div
        className="bg-yellow-400 h-4"
        style={{ width: `${100 * ratioAliveMax}%` }}
      >
        <div
          className="w-1/4 bg-green-700 h-4"
          style={{
            width: `${
              ratioAliveMax > 0 ? (100 * ratioAliveMin) / ratioAliveMax : 0
            }%`,
          }}
        ></div>
      </div>
    </div>
  );
}
