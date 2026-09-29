import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { GENERAL_INTERESTS, INDORE_SPECIFIC_TAGS, RELATIONSHIP_INTENTIONS } from '../../constants/interests';
import { INDORE_LOCALITIES } from '../../constants/indoreData';
import { useMatch } from '../../context/MatchContext';
import { InterestedIn, RelationshipIntent, FilterOptions } from '../../types';

export default function SearchScreen() {
  const { applyFilters } = useMatch();

  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(30);
  const [distanceKm, setDistanceKm] = useState(15);
  const [interestedIn, setInterestedIn] = useState<InterestedIn>('everyone');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [recentlyActiveOnly, setRecentlyActiveOnly] = useState(true);
  const [selectedIndoreTags, setSelectedIndoreTags] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);

  const toggleIndoreTag = (tag: string) => {
    if (selectedIndoreTags.includes(tag)) {
      setSelectedIndoreTags(selectedIndoreTags.filter((t) => t !== tag));
    } else {
      setSelectedIndoreTags([...selectedIndoreTags, tag]);
    }
  };

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const toggleLocality = (name: string) => {
    if (selectedLocalities.includes(name)) {
      setSelectedLocalities(selectedLocalities.filter((l) => l !== name));
    } else {
      setSelectedLocalities([...selectedLocalities, name]);
    }
  };

  const handleReset = () => {
    setMinAge(18);
    setMaxAge(35);
    setDistanceKm(25);
    setInterestedIn('everyone');
    setVerifiedOnly(false);
    setRecentlyActiveOnly(false);
    setSelectedIndoreTags([]);
    setSelectedInterests([]);
    setSelectedLocalities([]);
    applyFilters({});
  };

  const handleApply = async () => {
    const filters: Partial<FilterOptions> = {
      minAge,
      maxAge,
      maxDistanceKm: distanceKm,
      interestedIn,
      verifiedOnly,
      recentlyActiveOnly,
      selectedIndoreTags,
      selectedInterests,
    };
    await applyFilters(filters);
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Search & Filters" rightAction="none" showLocation={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>Find someone who matches your vibe</Text>
          <Text style={styles.introSubtitle}>
            All results are strictly located within Indore city limits.
          </Text>
        </View>

        {/* Interested In */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Show Me</Text>
          <View style={styles.pillRow}>
            {(['men', 'women', 'everyone'] as InterestedIn[]).map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[styles.pill, interestedIn === gender && styles.pillActive]}
                onPress={() => setInterestedIn(gender)}
              >
                <Text style={[styles.pillText, interestedIn === gender && styles.pillTextActive]}>
                  {gender === 'men' ? 'Men' : gender === 'women' ? 'Women' : 'Everyone'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Age Range */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Age Range</Text>
            <Text style={styles.valueBadge}>
              {minAge} — {maxAge} years
            </Text>
          </View>

          <View style={styles.ageSelectors}>
            <View style={styles.ageRow}>
              <Text style={styles.subLabel}>Min Age ({minAge})</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  onPress={() => setMinAge(Math.max(18, minAge - 1))}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepValue}>{minAge}</Text>
                <TouchableOpacity
                  onPress={() => setMinAge(Math.min(maxAge - 1, minAge + 1))}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.ageRow}>
              <Text style={styles.subLabel}>Max Age ({maxAge})</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  onPress={() => setMaxAge(Math.max(minAge + 1, maxAge - 1))}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepValue}>{maxAge}</Text>
                <TouchableOpacity
                  onPress={() => setMaxAge(Math.min(60, maxAge + 1))}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Maximum Distance */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Distance in Indore</Text>
            <Text style={styles.valueBadge}>Up to {distanceKm} km</Text>
          </View>

          <View style={styles.distanceChipsRow}>
            {[3, 5, 10, 15, 25].map((km) => (
              <TouchableOpacity
                key={km}
                style={[
                  styles.distChip,
                  distanceKm === km && styles.distChipActive,
                ]}
                onPress={() => setDistanceKm(km)}
              >
                <Text
                  style={[
                    styles.distChipText,
                    distanceKm === km && styles.distChipTextActive,
                  ]}
                >
                  {km} km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Indore Localities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Indore Localities</Text>
          <View style={styles.tagsContainer}>
            {INDORE_LOCALITIES.slice(0, 8).map((loc) => {
              const isSelected = selectedLocalities.includes(loc.name);
              return (
                <TouchableOpacity
                  key={loc.id}
                  style={[styles.tagPill, isSelected && styles.tagPillActive]}
                  onPress={() => toggleLocality(loc.name)}
                >
                  <Text style={[styles.tagPillText, isSelected && styles.tagPillTextActive]}>
                    {loc.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Indore Specific Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indore Vibe & Hangouts 🥨</Text>
          <View style={styles.tagsContainer}>
            {INDORE_SPECIFIC_TAGS.map((tag) => {
              const isSelected = selectedIndoreTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagPill, isSelected && styles.tagPillActive]}
                  onPress={() => toggleIndoreTag(tag)}
                >
                  <Text style={[styles.tagPillText, isSelected && styles.tagPillTextActive]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.tagsContainer}>
            {GENERAL_INTERESTS.slice(0, 10).map((tag) => {
              const isSelected = selectedInterests.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagPill, isSelected && styles.tagPillActive]}
                  onPress={() => toggleInterest(tag)}
                >
                  <Text style={[styles.tagPillText, isSelected && styles.tagPillTextActive]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Verification & Activity Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trust & Activity</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.toggleTitle}>Verified Profiles Only ✓</Text>
              <Text style={styles.toggleDesc}>Only show profiles with verified identity</Text>
            </View>
            <Switch
              value={verifiedOnly}
              onValueChange={setVerifiedOnly}
              trackColor={{ false: '#DDD', true: COLORS.primaryLight }}
              thumbColor={verifiedOnly ? COLORS.primary : '#FFF'}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.toggleTitle}>Active Recently 🟢</Text>
              <Text style={styles.toggleDesc}>Prioritize users active in the last 24 hours</Text>
            </View>
            <Switch
              value={recentlyActiveOnly}
              onValueChange={setRecentlyActiveOnly}
              trackColor={{ false: '#DDD', true: COLORS.primaryLight }}
              thumbColor={recentlyActiveOnly ? COLORS.primary : '#FFF'}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Button
            title="Reset"
            onPress={handleReset}
            variant="outline"
            size="md"
            style={styles.resetBtn}
          />
          <Button
            title="Apply Filters"
            onPress={handleApply}
            variant="primary"
            size="md"
            style={styles.applyBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: 40,
  },
  introBox: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    ...SHADOWS.sm,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
  },
  introSubtitle: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.dark,
  },
  valueBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.mutedText,
  },
  pillTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  ageSelectors: {
    gap: 12,
  },
  ageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subLabel: {
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.full,
    padding: 2,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
  },
  stepValue: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.dark,
  },
  distanceChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  distChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  distChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  distChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.mutedText,
  },
  distChipTextActive: {
    color: COLORS.white,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.dark,
  },
  tagPillTextActive: {
    color: COLORS.white,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark,
  },
  toggleDesc: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: SPACING.sm,
  },
  resetBtn: {
    flex: 1,
  },
  applyBtn: {
    flex: 2,
  },
});
