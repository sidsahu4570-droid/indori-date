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
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { EmptyState } from '../../components/common/EmptyState';
import { useMatch } from '../../context/MatchContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { formatRelativeTime } from '../../utils/dateUtils';

export default function MessagesScreen() {
  const { user } = useAuth();
  const { matches } = useMatch();
  const { messages } = useChat();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = matches.filter((match) => {
    const otherUserId = match.users.find((id) => id !== user?.id) || match.users[1];
    const profile = match.profiles[otherUserId];
    return profile?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleOpenConversation = (match: any) => {
    const otherUserId = match.users.find((id: string) => id !== user?.id) || match.users[1];
    const profile = match.profiles[otherUserId];

    router.push({
      pathname: '/chat/[id]',
      params: {
        id: match.id,
        userName: profile?.name || 'Match',
        userPhoto: profile?.photo || '',
        locality: profile?.locality || 'Indore',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Messages" rightAction="premium" showLocation={false} />

      {/* Search Conversations */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.mutedText} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search matches by name..."
          placeholderTextColor={COLORS.subtleText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.mutedText} />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Horizontal Active Stories / Online Matches */}
        {matches.length > 0 && (
          <View style={styles.activeStoriesSection}>
            <Text style={styles.storiesTitle}>Online in Indore 🟢</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesList}>
              {matches.map((match) => {
                const otherUserId = match.users.find((id) => id !== user?.id) || match.users[1];
                const profile = match.profiles[otherUserId];
                return (
                  <TouchableOpacity
                    key={match.id}
                    style={styles.storyItem}
                    onPress={() => handleOpenConversation(match)}
                  >
                    <View style={styles.storyAvatarWrapper}>
                      <Image
                        source={{ uri: profile?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800' }}
                        style={styles.storyAvatar}
                      />
                      <View style={styles.onlineBadge} />
                    </View>
                    <Text style={styles.storyName} numberOfLines={1}>
                      {profile?.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Conversation List */}
        <View style={styles.conversationsList}>
          <Text style={styles.listHeader}>Recent Chats</Text>
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => {
              const otherUserId = match.users.find((id) => id !== user?.id) || match.users[1];
              const profile = match.profiles[otherUserId];
              const chatMsgs = messages[match.id] || [];
              const lastMsg = chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : null;
              const hasUnread = lastMsg && !lastMsg.isRead && lastMsg.senderId !== user?.id;

              return (
                <TouchableOpacity
                  key={match.id}
                  style={[styles.convItem, hasUnread && styles.convItemUnread]}
                  onPress={() => handleOpenConversation(match)}
                  activeOpacity={0.75}
                >
                  <View style={styles.avatarWrap}>
                    <Image
                      source={{ uri: profile?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800' }}
                      style={styles.convAvatar}
                    />
                    <View style={styles.onlineDot} />
                  </View>

                  <View style={styles.convInfo}>
                    <View style={styles.convTopRow}>
                      <Text style={[styles.convName, hasUnread && styles.convNameUnread]}>
                        {profile?.name}
                      </Text>
                      <Text style={styles.convTime}>
                        {lastMsg ? formatRelativeTime(lastMsg.timestamp) : formatRelativeTime(match.matchedAt)}
                      </Text>
                    </View>

                    <Text style={styles.localitySub}>{profile?.locality || 'Indore'}</Text>

                    <View style={styles.convBottomRow}>
                      <Text
                        style={[styles.lastMsgText, hasUnread && styles.lastMsgTextUnread]}
                        numberOfLines={1}
                      >
                        {lastMsg ? lastMsg.text : match.lastMessage || 'Say hello! ✨'}
                      </Text>
                      {hasUnread && <View style={styles.unreadDot} />}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <EmptyState
              type="no-messages"
              actionTitle="Find Matches"
              onAction={() => router.push('/(tabs)')}
            />
          )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    height: 44,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.dark,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  activeStoriesSection: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6EC',
  },
  storiesTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.lg,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  storiesList: {
    paddingHorizontal: SPACING.lg,
    gap: 14,
  },
  storyItem: {
    alignItems: 'center',
    width: 64,
  },
  storyAvatarWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 2,
    borderWidth: 2,
    borderColor: COLORS.primary,
    position: 'relative',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  storyName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.dark,
    marginTop: 4,
    textAlign: 'center',
  },
  conversationsList: {
    paddingTop: SPACING.md,
  },
  listHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.mutedText,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  convItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F7EEF2',
  },
  convItemUnread: {
    backgroundColor: '#FFF5F8',
  },
  avatarWrap: {
    position: 'relative',
  },
  convAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  convInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  convTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  convName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.dark,
  },
  convNameUnread: {
    fontWeight: '900',
    color: COLORS.dark,
  },
  convTime: {
    fontSize: 11,
    color: COLORS.subtleText,
  },
  localitySub: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 1,
  },
  convBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMsgText: {
    fontSize: 13,
    color: COLORS.mutedText,
    flex: 1,
    marginRight: 8,
  },
  lastMsgTextUnread: {
    color: COLORS.dark,
    fontWeight: '700',
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
});
