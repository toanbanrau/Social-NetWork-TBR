import { atom } from "jotai";

export const count = atom(1);
export const readWriteAtom = atom(null,
(get, set) => {
    set(count, get(count) + 1);
  },
);