import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/theme';
import { useMatch } from '../../context/MatchContext';
import { useChat } from '../../context/ChatContext';

export default function TabLayout() {
  const { matches, connectionRequests } = useMatch();
  const { messages } = useChat();

  const totalMatchesCount = matches.length + connectionRequests.length;
  const unreadMessagesCount = Object.values(messages).reduce(
    (acc, list) => acc + list.filter((m) => !m.isRead && m.senderId !== 'current_user_id').length,
    0
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.mutedText,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {/* 1. DISCOVER */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'flame' : 'flame-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />

      {/* 2. SEARCH */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 3. MATCHES */}
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarBadge: totalMatchesCount > 0 ? totalMatchesCount : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />

      {/* 4. MESSAGES */}
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarBadge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 5. PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F5E6EC',
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 6,
    paddingTop: 6,
    ...SHADOWS.sm,
  },
  tabBarItem: {
    paddingVertical: 2,
    ...(Platform.OS === 'web'
      ? ({
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
        } as any)
      : {}),
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 2,
  },
  badge: {
    backgroundColor: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
    minWidth: 18,
    height: 18,
  },
});
