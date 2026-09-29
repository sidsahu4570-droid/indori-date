import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { PremiumProvider } from '../context/PremiumContext';
import { MatchProvider, useMatch } from '../context/MatchContext';
import { ChatProvider } from '../context/ChatContext';
import { NotificationBanner } from '../components/common/NotificationBanner';
import { MatchCelebrationModal } from '../components/matches/MatchCelebrationModal';

function RootNavigation() {
  const { matchCelebration, clearMatchCelebration } = useMatch();

  return (
    <>
      <StatusBar style="dark" />
      <NotificationBanner />

      {matchCelebration && (
        <MatchCelebrationModal
          visible={!!matchCelebration}
          currentUser={matchCelebration.currentUser}
          matchedUser={matchCelebration.matchedUser}
          matchId={matchCelebration.matchId}
          onClose={clearMatchCelebration}
        />
      )}

      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="premium/index" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="verification/index" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="safety/index" options={{ headerShown: false }} />
        <Stack.Screen name="settings/index" options={{ headerShown: false }} />
        <Stack.Screen name="settings/edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="admin/index" options={{ headerShown: false }} />
        <Stack.Screen name="legal/terms" options={{ headerShown: false }} />
        <Stack.Screen name="legal/privacy" options={{ headerShown: false }} />
        <Stack.Screen name="legal/guidelines" options={{ headerShown: false }} />
        <Stack.Screen name="legal/refund" options={{ headerShown: false }} />
        <Stack.Screen name="legal/safety-guidelines" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PremiumProvider>
        <MatchProvider>
          <ChatProvider>
            <RootNavigation />
          </ChatProvider>
        </MatchProvider>
      </PremiumProvider>
    </AuthProvider>
  );
}
