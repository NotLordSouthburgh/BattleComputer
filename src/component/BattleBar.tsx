import React, { useState } from 'react';

type BattleBarProps = {
  ratioAliveMax: number;
  ratioAliveMin: number;
  label?: string;
};

export function BattleBar({
  ratioAliveMax,
  ratioAliveMin,
  label,
}: BattleBarProps) {
  return (
    <div className="w-full h-6">
      <div className="w-full bg-reddy_high h-6 rounded relative z-0">
        <div className="absolute inset-0 text-sm p-0.5  z-10 w-full h-full text-white text-center">
          {label}
        </div>
        <div
          className="h-6 z-60 rounded bg-yellow-500"
          style={{ width: `${100 * ratioAliveMax}%` }}
        >
          <div
            className="w-1/4 bg-greeny h-6 rounded"
            style={{
              width: `${
                ratioAliveMax > 0 ? (100 * ratioAliveMin) / ratioAliveMax : 0
              }%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
