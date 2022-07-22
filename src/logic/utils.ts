export type CpuBreatherData = {
  lastBreath: number;
};

export type CancelToken = {
  cancelled: boolean;
};

export function CpuBreatherStart(): CpuBreatherData {
  return {
    lastBreath: new Date().getTime(),
  };
}

export async function CpuBreatherCheck(breath: CpuBreatherData) {
  const now = new Date().getTime();
  if (now - breath.lastBreath > 10) {
    // console.log('Breathe');
    await new Promise((resolved) => setTimeout(resolved, 2));
    breath.lastBreath = new Date().getTime();
  }
}
