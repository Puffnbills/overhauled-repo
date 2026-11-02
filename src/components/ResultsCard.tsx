import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Identification, SpecimenFact } from '../types/identification';
import { colors } from '../theme';

type ResultsCardProps = {
  identification: Identification;
};

export function ResultsCard({ identification }: ResultsCardProps) {
  const match = Math.round(identification.confidence * 100);
  const rock = identification.kind === 'Rock';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.badge, rock ? styles.rockBadge : styles.mineralBadge]}>
          <Text style={styles.badgeLabel}>{identification.kind}</Text>
        </View>
        <Text style={styles.match}>{match}% match</Text>
      </View>

      <Text accessibilityRole="header" style={styles.name}>
        {identification.commonName}
      </Text>
      <Text style={styles.scientific}>{identification.scientificName}</Text>
      <Text style={styles.formula}>{identification.formula}</Text>
      <Text style={styles.group}>{identification.group}</Text>

      <View style={styles.track} accessibilityLabel={`${match} percent match`}>
        <View style={[styles.fill, { width: `${match}%` }]} />
      </View>

      <Text style={styles.summary}>{identification.summary}</Text>

      <Section title="Field marks">
        {chunk(identification.fieldMarks, 2).map((row) => (
          <View key={row.map((fact) => fact.label).join('|')} style={styles.markRow}>
            {row.map((fact) => (
              <View key={fact.label} style={styles.tileWrap}>
                <FactTile fact={fact} />
              </View>
            ))}
            {row.length === 1 ? <View style={styles.tileWrap} /> : null}
          </View>
        ))}
      </Section>

      <Section title="Properties">
        {identification.properties.map((fact, index) => (
          <View
            key={fact.label}
            style={[styles.propertyRow, index === 0 ? styles.propertyFirst : null]}
          >
            <Text style={styles.propertyLabel}>{fact.label}</Text>
            <Text style={styles.propertyValue}>{fact.value}</Text>
          </View>
        ))}
      </Section>

      <Section title="Where it forms">
        <Text style={styles.body}>{identification.occurrence}</Text>
      </Section>

      <Section title="How to tell it apart">
        {identification.distinguishingFeatures.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <View style={styles.marker} />
            <Text style={styles.body}>{feature}</Text>
          </View>
        ))}
      </Section>

      <Section title="Often confused with">
        <View style={styles.pills}>
          {identification.lookalikes.map((name) => (
            <View key={name} style={styles.pill}>
              <Text style={styles.pillLabel}>{name}</Text>
            </View>
          ))}
        </View>
      </Section>

      {identification.sample ? (
        <Text style={styles.sample}>
          Sample reading. This card shows the identification layout. It is not a result from the
          photo.
        </Text>
      ) : null}
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function chunk<T>(items: T[], size: number) {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

function FactTile({ fact }: { fact: SpecimenFact }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{fact.label}</Text>
      <Text style={styles.tileValue}>{fact.value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paperRaised,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  mineralBadge: {
    backgroundColor: colors.moss,
  },
  rockBadge: {
    backgroundColor: colors.clay,
  },
  badgeLabel: {
    color: colors.paper,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  match: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  name: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '700',
  },
  scientific: {
    marginTop: 6,
    color: colors.inkSoft,
    fontSize: 16,
    fontStyle: 'italic',
  },
  formula: {
    marginTop: 8,
    color: colors.ink,
    fontFamily: 'monospace',
    fontSize: 16,
  },
  group: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  track: {
    marginTop: 16,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.line,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.sand,
  },
  summary: {
    marginTop: 16,
    color: colors.inkSoft,
    fontSize: 16,
    lineHeight: 23,
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    marginBottom: 10,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  markRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  tileWrap: {
    flex: 1,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.paper,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tileLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tileValue: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  propertyFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  propertyLabel: {
    flex: 1,
    color: colors.muted,
    fontSize: 15,
  },
  propertyValue: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  body: {
    flex: 1,
    color: colors.inkSoft,
    fontSize: 15,
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  marker: {
    width: 7,
    height: 7,
    marginTop: 7,
    borderRadius: 2,
    backgroundColor: colors.moss,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: colors.paper,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillLabel: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  sample: {
    marginTop: 22,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});
