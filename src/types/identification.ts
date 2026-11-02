export type SpecimenKind = 'Mineral' | 'Rock';

export type SpecimenFact = {
  label: string;
  value: string;
};

export type Identification = {
  commonName: string;
  scientificName: string;
  kind: SpecimenKind;
  group: string;
  formula: string;
  confidence: number;
  summary: string;
  fieldMarks: SpecimenFact[];
  properties: SpecimenFact[];
  occurrence: string;
  distinguishingFeatures: string[];
  lookalikes: string[];
  sample: boolean;
};
