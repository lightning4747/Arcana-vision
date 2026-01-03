export const STATE = {
  IDLE: 'idle',
  WHEEL: 'wheel',
  SELECTED: 'selected'
};

export const appState = {
  current: STATE.IDLE,
  hand: {
    x: 0, y: 0, z: 0,
    present: false,
    fist: false
  },
  smooth: { x: 0, y: 0 },
  selectedIndex: -1,
  time: 0
};
