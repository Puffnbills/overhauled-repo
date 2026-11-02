import { useSyncExternalStore } from 'react';

export type SpecimenPhoto = {
  uri: string;
  width: number;
  height: number;
};

let photo: SpecimenPhoto | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function setSpecimenPhoto(next: SpecimenPhoto) {
  photo = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getPhoto() {
  return photo;
}

export function useSpecimenPhoto() {
  return useSyncExternalStore(subscribe, getPhoto, getPhoto);
}
