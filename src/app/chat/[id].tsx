import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { SafetyPrompt } from '../../components/chat/SafetyPrompt';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useMatch } from '../../context/MatchContext';
import { FirestoreService } from '../../services/firestoreService';
import { ReportReason } from '../../types';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const conversationId = (params.id as string) || 'match_priya_user';
  const userName = (params.userName as string) || 'Priya Sharma';
  const userPhoto =
    (params.userPhoto as string) ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800';
  const locality = (params.locality as string) || 'Vijay Nagar, Indore';

  const { user } = useAuth();
  const { unmatchUser } = useMatch();
  const { messages, isTyping, loadConversationMessages, sendMessage, markAsRead } = useChat();

  const [inputMessage, setInputMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadConversationMessages(conversationId);
    markAsRead(conversationId);
  }, [conversationId]);

  const conversationMsgs = messages[conversationId] || [];

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    const textToSend = inputMessage;
    setInputMessage('');
    await sendMessage(conversationId, 'target_user_id', textToSend);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendPhoto = async () => {
    // Send a sample cafe photo
    const sampleCafePhoto =
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80';
    await sendMessage(conversationId, 'target_user_id', 'Let’s check out this spot in Vijay Nagar!', sampleCafePhoto);
  };

  const handleUnmatch = () => {
    setShowMenu(false);
    Alert.alert(
      `Unmatch with ${userName}?`,
      'This conversation will be permanently removed from your matches.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unmatch',
          style: 'destructive',
          onPress: async () => {
            await unmatchUser(conversationId);
            router.back();
          },
        },
      ]
    );
  };

  const handleBlock = () => {
    setShowMenu(false);
    Alert.alert(
      `Block ${userName}?`,
      'They will not be able to view your profile, message you, or see you on Indori Date.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block User',
          style: 'destructive',
          onPress: async () => {
            await FirestoreService.blockUser('current_user_id', 'target_user_id');
            await unmatchUser(conversationId);
            router.back();
          },
        },
      ]
    );
  };

  const handleConfirmReport = async (reason: ReportReason) => {
    setShowReportModal(false);
    await FirestoreService.submitReport({
      reporterId: 'current_user_id',
      reportedUserId: 'target_user_id',
      reportedUserName: userName,
      reason,
      evidence: 'Reported during chat conversation.',
    });
    Alert.alert('Report Submitted', 'Thank you for keeping Indori Date safe. Our team will review this report shortly.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>

        <View style={styles.headerUser}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: userPhoto }} style={styles.avatar} />
            <View style={styles.onlineBadge} />
          </View>
          <View>
            <Text style={styles.userName} numberOfLines={1}>
              {userName}
            </Text>
            <Text style={styles.userStatus}>📍 {locality}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.menuBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      {/* Chat Options Dropdown */}
      {showMenu && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setShowMenu(false);
              setShowReportModal(true);
            }}
          >
            <Ionicons name="flag-outline" size={18} color={COLORS.danger} />
            <Text style={styles.dropdownTextDanger}>Report User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleBlock}>
            <Ionicons name="ban-outline" size={18} color={COLORS.danger} />
            <Text style={styles.dropdownTextDanger}>Block User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleUnmatch}>
            <Ionicons name="heart-dislike-outline" size={18} color={COLORS.mutedText} />
            <Text style={styles.dropdownText}>Unmatch</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Safety Prompt */}
      <SafetyPrompt userName={userName.split(' ')[0]} />

      {/* Message List */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {conversationMsgs.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMine={msg.senderId === 'current_user_id'}
            />
          ))}

          {/* Typing Indicator */}
          {isTyping[conversationId] && (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>{userName.split(' ')[0]} is typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn} onPress={handleSendPhoto}>
            <Ionicons name="image-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Type your Indori message..."
            placeholderTextColor={COLORS.subtleText}
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendBtn, !inputMessage.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputMessage.trim()}
          >
            <Ionicons name="send" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Report Modal */}
      <Modal visible={showReportModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.reportModalCard}>
            <Text style={styles.reportTitle}>Report {userName}</Text>
            <Text style={styles.reportSubtitle}>
              Please select the primary reason for reporting this profile.
            </Text>

            {(
              [
                'Harassment or hate speech',
                'Fake profile / Impersonation',
                'Spam or commercial promotion',
                'Inappropriate content / Nudity',
                'Scam or asking for money',
                'Underage user',
              ] as ReportReason[]
            ).map((reason) => (
              <TouchableOpacity
                key={reason}
                style={styles.reasonBtn}
                onPress={() => handleConfirmReport(reason)}
              >
                <Text style={styles.reasonBtnText}>{reason}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.mutedText} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowReportModal(false)}
              style={styles.cancelReportBtn}
            >
              <Text style={styles.cancelReportText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E0E6',
    zIndex: 10,
  },
  backBtn: {
    padding: 6,
  },
  headerUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 6,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
  },
  userStatus: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  menuBtn: {
    padding: 6,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.xs,
    zIndex: 30,
    ...SHADOWS.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    minWidth: 160,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '600',
  },
  dropdownTextDanger: {
    fontSize: 14,
    color: COLORS.danger,
    fontWeight: '600',
  },
  messagesContent: {
    paddingVertical: SPACING.sm,
  },
  typingContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 4,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.mutedText,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#F0E0E6',
    gap: 8,
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
    color: COLORS.dark,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  sendBtnDisabled: {
    backgroundColor: '#E5D0D8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  reportModalCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.dark,
  },
  reportSubtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  reasonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reasonBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  cancelReportBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelReportText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.mutedText,
  },
});
