export type CpuBreatherData = {
  cancelled: boolean;
  paused: boolean;
  lastBreath: number;
};

export function CpuBreatherStart(): CpuBreatherData {
  return {
    lastBreath: new Date().getTime(),
    cancelled: false,
    paused: false,
  };
}

export async function CpuBreatherCheck(breath: CpuBreatherData) {
  if (breath.cancelled) throw new Error('CANCELLED');

  const now = new Date().getTime();
  if (now - breath.lastBreath > 10) {
    // console.log('Breathe');
    await new Promise((resolved) => setTimeout(resolved, 2));
    breath.lastBreath = new Date().getTime();
  }

  while (breath.paused) {
    console.log('(inside) paused');
    await new Promise((resolved) => setTimeout(resolved, 50));
  }
}
