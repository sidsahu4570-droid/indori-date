import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from '../../components/common/Button';
import { usePremium } from '../../context/PremiumContext';
import { PremiumPlan } from '../../types';

export default function PremiumScreen() {
  const { plans, isPremium, purchasePlan, activeSubscription } = usePremium();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('six_months');
  const [loading, setLoading] = useState(false);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[1];

  const handlePurchase = async () => {
    setLoading(true);
    const result = await purchasePlan(selectedPlan);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Premium Activated Successfully ❤️',
        `Welcome to Indori Date VIP! You now have unlimited likes, priority discovery across Indore, and VIP status.`,
        [
          {
            text: 'Start Exploring',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert('Payment Error', result.error || 'Payment failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Indori Date VIP</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* VIP Hero Banner */}
        <LinearGradient
          colors={['#171717', '#331B2A', '#171717']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.vipCrownBadge}>
            <Ionicons name="sparkles" size={24} color={COLORS.gold} />
          </View>
          <Text style={styles.heroTitle}>Elevate Your Indore Dating Life</Text>
          <Text style={styles.heroSubtitle}>
            Get 5x more mutual matches in Vijay Nagar, Palasia, and across Indore.
          </Text>

          {isPremium && (
            <View style={styles.activePill}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.activePillText}>
                Active Plan: {activeSubscription?.planName || 'VIP Member'}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Pricing Tier Selector */}
        <Text style={styles.sectionHeader}>Choose Your Plan</Text>
        <View style={styles.plansContainer}>
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardSelected,
                  plan.isPopular && styles.planCardPopular,
                ]}
                onPress={() => setSelectedPlanId(plan.id)}
                activeOpacity={0.85}
              >
                {plan.tag && (
                  <View style={[styles.planTag, isSelected && styles.planTagSelected]}>
                    <Text style={styles.planTagText}>{plan.tag}</Text>
                  </View>
                )}

                <View style={styles.planCardBody}>
                  <View style={styles.planLeft}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planDiscount}>Save {plan.discountPercent}% OFF</Text>
                  </View>

                  <View style={styles.planRight}>
                    <Text style={styles.planPrice}>₹{plan.priceInr}</Text>
                    <Text style={styles.planOriginalPrice}>₹{plan.originalPriceInr}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* VIP Features List */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>What’s Included with VIP</Text>
          <View style={styles.featuresList}>
            {selectedPlan.features.map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.gold} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Razorpay Trust Badge */}
        <View style={styles.securityBox}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
          <Text style={styles.securityText}>
            Secured by Razorpay. 100% encrypted & trusted Indian payment gateway.
          </Text>
        </View>

        {/* CTA Button */}
        <Button
          title={isPremium ? 'Renew / Change Plan' : `Unlock VIP for ₹${selectedPlan.priceInr}`}
          onPress={handlePurchase}
          variant="gold"
          size="lg"
          loading={loading}
          icon={<Ionicons name="sparkles" size={20} color={COLORS.dark} />}
          textStyle={{ color: COLORS.dark }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E6EC',
    backgroundColor: COLORS.white,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: 40,
  },
  heroBanner: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.lg,
  },
  vipCrownBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(212, 167, 44, 0.15)',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 18,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 160, 107, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginTop: 6,
  },
  activePillText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.dark,
    marginTop: 4,
  },
  plansContainer: {
    gap: 12,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#F0E0E6',
    padding: SPACING.md,
    position: 'relative',
    ...SHADOWS.sm,
  },
  planCardSelected: {
    borderColor: COLORS.gold,
    backgroundColor: '#FFFDF5',
  },
  planCardPopular: {
    borderWidth: 2,
  },
  planTag: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: COLORS.dark,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  planTagSelected: {
    backgroundColor: COLORS.gold,
  },
  planTagText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planLeft: {
    gap: 2,
  },
  planName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.dark,
  },
  planDiscount: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
  planRight: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.dark,
  },
  planOriginalPrice: {
    fontSize: 12,
    color: COLORS.subtleText,
    textDecorationLine: 'line-through',
  },
  featuresCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#F0E0E6',
    gap: SPACING.md,
  },
  featuresTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.dark,
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: '600',
    flex: 1,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  securityText: {
    fontSize: 12,
    color: '#166534',
    flex: 1,
    lineHeight: 16,
    fontWeight: '500',
  },
});
