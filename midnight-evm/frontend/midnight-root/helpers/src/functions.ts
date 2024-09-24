import { ValuesOf } from './types.js';

export const block = <T>(thunk: () => T): T => thunk();

export const values = <T extends object>(object: T): ReadonlyArray<ValuesOf<T>> => {
  // this way it's slightly easier for TS to typecheck this properly compared to a purely functional version
  const arr = [];
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      arr.push(object[key]);
    }
  }
  return arr;
};

export function lazy<T>(factory: () => T): () => T {
  let value: T | null = null;
  return () => {
    if (value === null) {
      const newValue = factory();
      value = newValue;
      return newValue;
    } else {
      return value;
    }
  };
}
