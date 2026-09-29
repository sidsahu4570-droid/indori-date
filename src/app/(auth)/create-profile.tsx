import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { GENERAL_INTERESTS, INDORE_SPECIFIC_TAGS, RELATIONSHIP_INTENTIONS } from '../../constants/interests';
import { INDORE_LOCALITIES } from '../../constants/indoreData';
import { RelationshipIntent, UserProfile } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
];

export default function CreateProfileScreen() {
  const params = useLocalSearchParams();
  const { signup, isLoading } = useAuth();

  const [photos, setPhotos] = useState<string[]>(SAMPLE_PHOTO_PRESETS);
  const [bio, setBio] = useState(
    'Proud Indori! Looking for someone who loves midnight Sarafa food walks, filter brew at Vijay Nagar cafés, and long drives.'
  );
  const [occupation, setOccupation] = useState('Marketing Lead / Entrepreneur');
  const [education, setEducation] = useState('SGSITS / DAVV Indore');
  const [height, setHeight] = useState("5'7\"");
  const [selectedLocality, setSelectedLocality] = useState(INDORE_LOCALITIES[0].name);
  const [relationshipIntent, setRelationshipIntent] = useState<RelationshipIntent>('Long-term relationship');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Foodie 🍲',
    'Café Hopping ☕',
    'Music 🎵',
    'Road Trips 🚗',
  ]);
  const [selectedIndoreTags, setSelectedIndoreTags] = useState<string[]>([
    'Sarafa Food Walk 🌙',
    'Chappan Dukan Poha 🍽️',
    'Vijay Nagar Nightlife 🍸',
  ]);

  const toggleGeneralInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tag));
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, tag]);
      }
    }
  };

  const toggleIndoreTag = (tag: string) => {
    if (selectedIndoreTags.includes(tag)) {
      setSelectedIndoreTags(selectedIndoreTags.filter((t) => t !== tag));
    } else {
      if (selectedIndoreTags.length < 5) {
        setSelectedIndoreTags([...selectedIndoreTags, tag]);
      }
    }
  };

  const handleFinishProfile = async () => {
    const userPayload: Partial<UserProfile> = {
      name: (params.name as string) || 'Indori User',
      email: (params.email as string) || 'user@indori.com',
      phone: (params.phone as string) || '',
      dob: (params.dob as string) || '2001-05-15',
      age: parseInt((params.age as string) || '24', 10),
      gender: (params.gender as any) || 'female',
      interestedIn: (params.interestedIn as any) || 'men',
      photos,
      bio,
      occupation,
      education,
      height,
      relationshipIntent,
      interests: selectedInterests,
      indoreInterests: selectedIndoreTags,
      location: {
        locality: selectedLocality,
        distanceKm: 0,
      },
      city: 'Indore',
      isIndoreResident: true,
      isAdult: true,
    };

    await signup(userPayload);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Step 2 of 2: Indore Vibe</Text>
          <Text style={styles.headerTitle}>Build Your Profile</Text>
        </View>

        {/* Photos Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Photos</Text>
          <Text style={styles.sectionSubtitle}>Add up to 3 photos that showcase your real personality</Text>
          <View style={styles.photoGrid}>
            {photos.map((uri, idx) => (
              <View key={idx} style={styles.photoCard}>
                <Image source={{ uri }} style={styles.photoImage} />
                <View style={styles.photoBadge}>
                  <Text style={styles.photoBadgeText}>#{idx + 1}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Indore Locality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Indore Locality 📍</Text>
          <Text style={styles.sectionSubtitle}>Select the area where you live or spend most time</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.localityScroll}>
            {INDORE_LOCALITIES.map((loc) => {
              const isSelected = selectedLocality === loc.name;
              return (
                <TouchableOpacity
                  key={loc.id}
                  style={[styles.localityChip, isSelected && styles.localityChipActive]}
                  onPress={() => setSelectedLocality(loc.name)}
                >
                  <Text style={[styles.localityChipText, isSelected && styles.localityChipTextActive]}>
                    {loc.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About You (Bio)</Text>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            placeholder="Share your hobbies, favorite Indore hangout spots..."
            placeholderTextColor={COLORS.subtleText}
          />
        </View>

        {/* Relationship Intention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relationship Intention</Text>
          <View style={styles.intentGrid}>
            {RELATIONSHIP_INTENTIONS.map((intent) => {
              const isSelected = relationshipIntent === intent.value;
              return (
                <TouchableOpacity
                  key={intent.value}
                  style={[styles.intentOption, isSelected && styles.intentOptionActive]}
                  onPress={() => setRelationshipIntent(intent.value as RelationshipIntent)}
                >
                  <Text style={[styles.intentOptionTitle, isSelected && styles.intentOptionTitleActive]}>
                    {intent.label}
                  </Text>
                  <Text style={[styles.intentOptionDesc, isSelected && styles.intentOptionDescActive]}>
                    {intent.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Indore-Specific Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indore Favorites 🥨 (Select up to 5)</Text>
          <View style={styles.tagsContainer}>
            {INDORE_SPECIFIC_TAGS.map((tag) => {
              const isSelected = selectedIndoreTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagPill, isSelected && styles.tagPillActiveIndori]}
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

        {/* General Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests & Passions (Select up to 5)</Text>
          <View style={styles.tagsContainer}>
            {GENERAL_INTERESTS.map((tag) => {
              const isSelected = selectedInterests.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagPill, isSelected && styles.tagPillActive]}
                  onPress={() => toggleGeneralInterest(tag)}
                >
                  <Text style={[styles.tagPillText, isSelected && styles.tagPillTextActive]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Occupation, Education, Height */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional & Personal</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Occupation</Text>
            <TextInput
              style={styles.fieldInput}
              value={occupation}
              onChangeText={setOccupation}
              placeholder="e.g. Architect, Software Engineer"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Education</Text>
            <TextInput
              style={styles.fieldInput}
              value={education}
              onChangeText={setEducation}
              placeholder="e.g. SGSITS Indore, IIM Indore"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Height</Text>
            <TextInput
              style={styles.fieldInput}
              value={height}
              onChangeText={setHeight}
              placeholder="e.g. 5'7&quot;"
            />
          </View>
        </View>

        {/* Submit */}
        <Button
          title="Complete Profile & Start Dating 🚀"
          onPress={handleFinishProfile}
          variant="primary"
          size="lg"
          loading={isLoading}
          style={{ marginTop: SPACING.md }}
        />
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
    padding: SPACING.xl,
    gap: SPACING.lg,
    paddingBottom: 60,
  },
  header: {
    marginBottom: SPACING.xs,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
    ...SHADOWS.sm,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
    marginTop: 2,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginBottom: 4,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  photoCard: {
    flex: 1,
    height: 130,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.sm,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  photoBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  localityScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  localityChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#F0E0E6',
  },
  localityChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  localityChipText: {
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: '600',
  },
  localityChipTextActive: {
    color: COLORS.white,
  },
  bioInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 14,
    color: COLORS.dark,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  intentGrid: {
    gap: 8,
  },
  intentOption: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  intentOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F8',
  },
  intentOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dark,
  },
  intentOptionTitleActive: {
    color: COLORS.primaryDark,
  },
  intentOptionDesc: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  intentOptionDescActive: {
    color: '#884466',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#F0E0E6',
  },
  tagPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagPillActiveIndori: {
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
  inputGroup: {
    gap: 4,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.dark,
  },
  fieldInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    fontSize: 14,
    color: COLORS.dark,
  },
});
