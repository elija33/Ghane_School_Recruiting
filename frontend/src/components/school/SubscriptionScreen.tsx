import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { Button, Card, Chip, Divider, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchSubscriptionStatus } from '../../store/slices/schoolSlice';
import { subscriptionService, SUBSCRIPTION_PLANS } from '../../services/subscriptionService';
import { extractErrorMessage } from '../../services/api';
import styles from './style/SubscriptionScreen.styles';

export default function SubscriptionScreen() {
  const dispatch = useAppDispatch();
  const { subscription, profile } = useAppSelector((s) => s.school);
  const { user } = useAppSelector((s) => s.auth);

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [initiating, setInitiating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [pendingRef, setPendingRef] = useState('');

  const isActive = subscription?.status === 'ACTIVE';

  useEffect(() => {
    dispatch(fetchSubscriptionStatus());
  }, [dispatch]);

  const handleSubscribe = async (plan: string) => {
    setSelectedPlan(plan);
    setInitiating(true);
    setError('');
    try {
      const res = await subscriptionService.initializeSubscription({
        plan,
        email: user?.email ?? '',
      });
      setCheckoutUrl(res.authorizationUrl);
      setPendingRef(res.reference);
      await Linking.openURL(res.authorizationUrl);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setInitiating(false);
    }
  };

  const handleVerifyPayment = async () => {
    setVerifying(true);
    setError('');
    try {
      await subscriptionService.verifySubscription({ reference: pendingRef });
      dispatch(fetchSubscriptionStatus());
      setCheckoutUrl('');
      setPendingRef('');
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Current Status */}
      <Card style={styles.statusCard}>
        <Card.Content style={styles.statusContent}>
          <Ionicons
            name={isActive ? 'checkmark-circle' : 'close-circle'}
            size={48}
            color={isActive ? '#27AE60' : '#E74C3C'}
          />
          <Text style={styles.statusTitle}>
            {isActive ? 'Subscription Active' : 'No Active Subscription'}
          </Text>
          {isActive && profile?.subscriptionTier && (
            <Chip style={styles.planChip} textStyle={{ color: '#1B4F72', fontWeight: '600' }}>
              {profile.subscriptionTier} Plan
            </Chip>
          )}
          {isActive && profile?.subscriptionEnd && (
            <Text style={styles.expiryText}>
              Expires {format(new Date(profile.subscriptionEnd), 'MMMM d, yyyy')}
            </Text>
          )}
          {!isActive && (
            <Text style={styles.statusSub}>
              Subscribe to post job listings and browse teacher profiles
            </Text>
          )}
        </Card.Content>
      </Card>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {checkoutUrl ? (
        <Card style={styles.verifyCard}>
          <Card.Content style={styles.verifyContent}>
            <Ionicons name="time-outline" size={32} color="#F39C12" />
            <Text style={styles.verifyTitle}>Payment Window Open</Text>
            <Text style={styles.verifySub}>
              Complete your payment in the browser, then tap below to confirm.
            </Text>
            <Button
              mode="contained"
              onPress={handleVerifyPayment}
              loading={verifying}
              disabled={verifying}
              buttonColor="#27AE60"
              style={styles.verifyBtn}
            >
              I've Completed Payment
            </Button>
            <Button mode="text" onPress={() => Linking.openURL(checkoutUrl)} textColor="#1B4F72">
              Re-open Payment Page
            </Button>
          </Card.Content>
        </Card>
      ) : null}

      {/* Plans */}
      <Text style={styles.sectionTitle}>Choose a Plan</Text>
      {SUBSCRIPTION_PLANS.map((plan) => {
        const isCurrentPlan = profile?.subscriptionTier === plan.tier && isActive;
        return (
          <Card
            key={plan.tier}
            style={[styles.planCard, plan.recommended && styles.recommendedCard]}
          >
            {plan.recommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Most Popular</Text>
              </View>
            )}
            <Card.Content style={styles.planContent}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.planPrice}>GH₵{(plan.amountInPesewas / 100).toFixed(2)}</Text>
                  <Text style={styles.planPeriod}>/month</Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              {plan.features.map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#27AE60" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}

              <Button
                mode={isCurrentPlan ? 'outlined' : 'contained'}
                onPress={() => !isCurrentPlan && handleSubscribe(plan.tier)}
                loading={initiating && selectedPlan === plan.tier}
                disabled={isCurrentPlan || (initiating && selectedPlan !== plan.tier)}
                buttonColor="#1B4F72"
                style={styles.planBtn}
                contentStyle={{ paddingVertical: 6 }}
              >
                {isCurrentPlan ? 'Current Plan' : 'Subscribe'}
              </Button>
            </Card.Content>
          </Card>
        );
      })}

      <Text style={styles.disclaimer}>
        Payments are processed securely by Paystack. Subscriptions auto-renew monthly.
        Cancel anytime by contacting support.
      </Text>
    </ScrollView>
  );
}

