import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { INDORE_LOCALITIES } from '../../constants/indoreData';
import { INDORE_SPECIFIC_TAGS, GENERAL_INTERESTS, RELATIONSHIP_INTENTIONS } from '../../constants/interests';
import { RelationshipIntent } from '../../types';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [education, setEducation] = useState(user?.education || '');
  const [height, setHeight] = useState(user?.height || "5'10\"");
  const [locality, setLocality] = useState(user?.location?.locality || 'Vijay Nagar');
  const [relationshipIntent, setRelationshipIntent] = useState<RelationshipIntent>(
    user?.relationshipIntent || 'Long-term relationship'
  );
  const [selectedIndoreTags, setSelectedIndoreTags] = useState<string[]>(
    user?.indoreInterests || ['Sarafa Food Walk 🌙', 'Chappan Dukan Poha 🍽️']
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests || ['Foodie 🍲', 'Café Hopping ☕']
  );
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      name,
      bio,
      occupation,
      education,
      height,
      location: {
        locality,
        distanceKm: 0,
      },
      relationshipIntent,
      indoreInterests: selectedIndoreTags,
      interests: selectedInterests,
    });
    setSaving(false);
    Alert.alert('Saved', 'Your Indori Date profile has been updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Edit Profile" rightAction="none" showLocation={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        {/* Locality */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Indore Locality</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.localityRow}>
            {INDORE_LOCALITIES.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={[styles.chip, locality === loc.name && styles.chipActive]}
                onPress={() => setLocality(loc.name)}
              >
                <Text style={[styles.chipText, locality === loc.name && styles.chipTextActive]}>
                  {loc.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bio */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bio</Text>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Relationship Intent */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Relationship Intention</Text>
          <View style={styles.intentWrap}>
            {RELATIONSHIP_INTENTIONS.map((intent) => (
              <TouchableOpacity
                key={intent.value}
                style={[
                  styles.intentBtn,
                  relationshipIntent === intent.value && styles.intentBtnActive,
                ]}
                onPress={() => setRelationshipIntent(intent.value as RelationshipIntent)}
              >
                <Text
                  style={[
                    styles.intentText,
                    relationshipIntent === intent.value && styles.intentTextActive,
                  ]}
                >
                  {intent.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Indore Tags */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Favorite Indore Spots 🥨</Text>
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

        {/* Occupation & Education */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Occupation</Text>
          <TextInput style={styles.input} value={occupation} onChangeText={setOccupation} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Education</Text>
          <TextInput style={styles.input} value={education} onChangeText={setEducation} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Height</Text>
          <TextInput style={styles.input} value={height} onChangeText={setHeight} />
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          variant="primary"
          size="lg"
          loading={saving}
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
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: 50,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.dark,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    fontSize: 14,
    color: COLORS.dark,
  },
  bioInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 14,
    color: COLORS.dark,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  localityRow: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#F0E0E6',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.white,
  },
  intentWrap: {
    gap: 6,
  },
  intentBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  intentBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F8',
  },
  intentText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
  },
  intentTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#F0E0E6',
  },
  tagPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagPillText: {
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: '600',
  },
  tagPillTextActive: {
    color: COLORS.white,
  },
});
