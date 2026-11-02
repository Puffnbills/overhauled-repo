import type { Identification } from '../types/identification';

export const sampleIdentification: Identification = {
  commonName: 'Amethyst',
  scientificName: 'Quartz, amethyst variety',
  kind: 'Mineral',
  group: 'Silicates',
  formula: 'SiO₂',
  confidence: 0.92,
  summary:
    'Purple quartz colored by iron and natural irradiation. It usually grows as glassy points lining a geode or cavity.',
  fieldMarks: [
    { label: 'Color', value: 'Violet to pale lavender' },
    { label: 'Luster', value: 'Vitreous' },
    { label: 'Hardness', value: '7' },
    { label: 'Streak', value: 'White' },
  ],
  properties: [
    { label: 'Crystal system', value: 'Trigonal' },
    { label: 'Habit', value: 'Prismatic points' },
    { label: 'Cleavage', value: 'None' },
    { label: 'Fracture', value: 'Conchoidal' },
    { label: 'Specific gravity', value: '2.65' },
    { label: 'Transparency', value: 'Transparent to translucent' },
  ],
  occurrence:
    'Common in volcanic geodes, hydrothermal veins, and cavities in basalt. Color can fade toward colorless quartz if the specimen is heated.',
  distinguishingFeatures: [
    'Scratches window glass and a steel knife. Softer purple minerals do not.',
    'No cleavage planes. Broken faces are curved, like chipped glass.',
    'Color sits in bands or zones inside otherwise glassy quartz.',
  ],
  lookalikes: ['Fluorite', 'Purple calcite', 'Lepidolite'],
  sample: true,
};
