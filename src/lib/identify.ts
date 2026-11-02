import { sampleIdentification } from '../data/sampleIdentification';
import { saveReading, type SpecimenPhoto, type SpecimenReading } from '../state/capture';
import type { Identification } from '../types/identification';

const inFlight = new Map<string, Promise<SpecimenReading>>();

export function identifySpecimen(_photo: SpecimenPhoto): Promise<Identification> {
  return Promise.resolve(sampleIdentification);
}

export function identifyPhoto(photo: SpecimenPhoto) {
  const existing = inFlight.get(photo.uri);
  if (existing) {
    return existing;
  }

  const task = identifySpecimen(photo)
    .then((identification) => saveReading(photo, identification))
    .finally(() => {
      inFlight.delete(photo.uri);
    });

  inFlight.set(photo.uri, task);
  return task;
}
