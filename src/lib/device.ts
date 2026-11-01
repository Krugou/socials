// src/lib/device.ts
// Device capability checks used to scale back decorative effects. Nothing here is sent anywhere.

interface DeviceNavigator extends Navigator {
  deviceMemory?: number;
}

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Few CPU cores or little memory, where blurred animated layers are costly */
export const isLowPowerDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const {hardwareConcurrency, deviceMemory} = navigator as DeviceNavigator;
  return (hardwareConcurrency ?? 8) <= 4 || (deviceMemory ?? 8) <= 4;
};

/**
 * How many decorative particles to render: none with reduced motion, a handful on low-power devices
 */
export const getParticleBudget = (max: number): number => {
  if (prefersReducedMotion()) return 0;
  return isLowPowerDevice() ? Math.min(max, 10) : max;
};

/** Duration for transitions, zero when the visitor prefers reduced motion */
export const motionDuration = (ms: number): number => (prefersReducedMotion() ? 0 : ms);

/** Runs the callback once the browser is idle so decorative work does not delay first paint */
export const whenIdle = (callback: () => void): void => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, {timeout: 1500});
  } else {
    setTimeout(callback, 200);
  }
};
