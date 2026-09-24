import {Easing, interpolate} from 'remotion';

export const FPS = 30;
export const DURATION = 30 * FPS;

// 300ms at 30fps.
export const T300 = 9;

// Key moments, in frames.
export const t = {
  phoneIn: 6,
  homeIn: 24,
  tapBook: 120,
  calendarIn: 126,
  tapDate: 186,
  slotsIn: 192,
  tapSlot: 258,
  tapContinue: 330,
  detailIn: 336,
  tapConfirm: 516,
  confirmIn: 522,
  endIn: 705,
};

// Scene windows for the side captions.
export const captionWindows: [number, number][] = [
  [30, t.calendarIn],
  [t.calendarIn, t.detailIn],
  [t.detailIn, t.confirmIn],
  [t.confirmIn, t.endIn],
];

export const easeOut = Easing.bezier(0.215, 0.61, 0.355, 1);

/** 0 → 1 over `duration` frames starting at `start`, ease-out, clamped. */
export const progress = (
  frame: number,
  start: number,
  duration: number = T300,
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** Press feedback for a tapped control: 1 → 0.97 → 1 around the tap frame. */
export const pressScale = (frame: number, tapFrame: number) => {
  if (frame < tapFrame - 1 || frame > tapFrame + 8) return 1;
  const down = progress(frame, tapFrame - 1, 3);
  const up = progress(frame, tapFrame + 3, 5);
  return 1 - 0.03 * down + 0.03 * up;
};
