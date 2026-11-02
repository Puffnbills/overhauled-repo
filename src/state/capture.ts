import { useSyncExternalStore } from 'react';

import type { Identification } from '../types/identification';

export type SpecimenPhoto = {
  uri: string;
  width: number;
  height: number;
};

export type SpecimenReading = {
  id: string;
  photo: SpecimenPhoto;
  identification: Identification;
  createdAt: number;
};

let photo: SpecimenPhoto | null = null;
let readings: SpecimenReading[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function setSpecimenPhoto(next: SpecimenPhoto) {
  photo = next;
  emit();
}

export function saveReading(target: SpecimenPhoto, identification: Identification) {
  const latest = readings[0];
  if (latest && latest.photo.uri === target.uri && Date.now() - latest.createdAt < 1500) {
    return latest;
  }

  const reading: SpecimenReading = {
    id: `${Date.now()}`,
    photo: target,
    identification,
    createdAt: Date.now(),
  };
  readings = [reading, ...readings];
  emit();
  return reading;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getPhoto() {
  return photo;
}

function getReadings() {
  return readings;
}

export function useSpecimenPhoto() {
  return useSyncExternalStore(subscribe, getPhoto, getPhoto);
}

export function useReadings() {
  return useSyncExternalStore(subscribe, getReadings, getReadings);
}

export function useReading(id?: string) {
  const list = useReadings();
  if (id) {
    return list.find((reading) => reading.id === id) ?? null;
  }
  return list[0] ?? null;
}
