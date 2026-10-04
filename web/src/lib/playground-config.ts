export type PlaygroundMode = 'dual' | 'v1-only' | 'v2-only';

export const PLAYGROUND_CONFIG = {
  // 'dual': Shows tabs for both Version 1 (Quest Arena) and Version 2 (Virtual Interactive Guidebook)
  // 'v1-only': Only displays Version 1
  // 'v2-only': Promotes Version 2 as the single canonical playground experience
  mode: 'dual' as PlaygroundMode,
};
