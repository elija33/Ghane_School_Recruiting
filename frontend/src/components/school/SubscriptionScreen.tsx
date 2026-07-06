import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchSubscriptionStatus } from '../../store/slices/schoolSlice';
import { subscriptionService, SUBSCRIPTION_PLANS } from '../../services/subscriptionService';
import { extractErrorMessage } from '../../services/api';

const PRIMARY = '#2C3E50';
const ACCENT  = '#1B4F72';
const GREEN   = '#27AE60';
const ORANGE  = '#F39C12';
const RED     = '#E74C3C';

function FeatureRow({ text, inverted }: { text: string; inverted?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <View style={{
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: inverted ? 'rgba(255,255,255,0.2)' : '#EAFAF1',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Ionicons name="checkmark" size={13} color={inverted ? '#fff' : GREEN} />
      </View>
      <Text style={{ fontSize: 14, color: inverted ? 'rgba(255,255,255,0.9)' : '#444', flex: 1, lineHeight: 20 }}>
        {text}
      </Text>
    </View>
  );
}

export default function SubscriptionScreen() {
  const dispatch = useAppDispatch();
  const { subscription, profile } = useAppSelector((s) => s.school);
  const { user } = useAppSelector((s) => s.auth as any);

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [initiating, setInitiating]     = useState(false);
  const [verifying, setVerifying]       = useState(false);
  const [error, setError]               = useState('');
  const [checkoutUrl, setCheckoutUrl]   = useState('');
  const [pendingRef, setPendingRef]     = useState('');

  const isActive = subscription?.status === 'ACTIVE';

  useEffect(() => { dispatch(fetchSubscriptionStatus()); }, [dispatch]);

  const handleSubscribe = async (plan: string) => {
    setSelectedPlan(plan);
    setInitiating(true);
    setError('');
    try {
      const res = await subscriptionService.initializeSubscription({ plan, email: user?.email ?? '' });
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
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F0F3F8' }}
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      {/* ── Header ── */}
      <View style={{
        backgroundColor: PRIMARY,
        paddingTop: 52, paddingBottom: 36, paddingHorizontal: 24,
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 6 }}>
          Subscription Plans
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'center' }}>
          Choose the plan that fits your school's needs
        </Text>
      </View>

      <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
        <View style={{ width: '100%', maxWidth: 900 }}>

          {/* ── Status card ── */}
          <View style={{
            backgroundColor: isActive ? '#EAFAF1' : '#FDEDEC',
            borderRadius: 16, padding: 20, marginTop: 24, marginBottom: 8,
            flexDirection: 'row', alignItems: 'center', gap: 16,
            borderWidth: 1, borderColor: isActive ? '#A9DFBF' : '#F1948A',
          }}>
            <View style={{
              width: 52, height: 52, borderRadius: 26,
              backgroundColor: isActive ? '#D5F5E3' : '#FADBD8',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name={isActive ? 'checkmark-circle' : 'close-circle'} size={28} color={isActive ? GREEN : RED} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: isActive ? '#1E8449' : '#922B21', marginBottom: 2 }}>
                {isActive ? 'Subscription Active' : 'No Active Subscription'}
              </Text>
              {isActive && profile?.subscriptionTier ? (
                <Text style={{ fontSize: 13, color: '#1E8449' }}>
                  {profile.subscriptionTier} Plan
                  {profile.subscriptionEnd ? ` · Expires ${format(new Date(profile.subscriptionEnd), 'MMM d, yyyy')}` : ''}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, color: '#922B21' }}>
                  Subscribe to post jobs and browse teachers
                </Text>
              )}
            </View>
          </View>

          {/* ── Error ── */}
          {error ? (
            <View style={{ backgroundColor: '#FDEDEC', borderRadius: 12, padding: 14, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="alert-circle-outline" size={18} color={RED} />
              <Text style={{ color: '#922B21', fontSize: 13, flex: 1 }}>{error}</Text>
            </View>
          ) : null}

          {/* ── Pending payment banner ── */}
          {checkoutUrl ? (
            <View style={{
              backgroundColor: '#FEF9E7', borderRadius: 16, padding: 20, marginTop: 12,
              borderWidth: 1.5, borderColor: ORANGE, alignItems: 'center', gap: 10,
            }}>
              <Ionicons name="time-outline" size={30} color={ORANGE} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: PRIMARY }}>Payment Window Open</Text>
              <Text style={{ fontSize: 13, color: '#7F8C8D', textAlign: 'center', lineHeight: 20 }}>
                Complete your payment in the browser, then tap below to confirm.
              </Text>
              <Button mode="contained" onPress={handleVerifyPayment} loading={verifying} disabled={verifying} buttonColor={GREEN} style={{ borderRadius: 10, width: '100%' }} contentStyle={{ paddingVertical: 4 }}>
                I've Completed Payment
              </Button>
              <Button mode="text" onPress={() => Linking.openURL(checkoutUrl)} textColor={ACCENT}>Re-open Payment Page</Button>
            </View>
          ) : null}

          {/* ── Plan cards ── */}
          <Text style={{ fontSize: 16, fontWeight: '700', color: PRIMARY, marginTop: 28, marginBottom: 16 }}>
            Choose a Plan
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrentPlan = profile?.subscriptionTier === plan.tier && isActive;
            const featured = !!plan.recommended;

            return (
              <View
                key={plan.tier}
                style={{
                  flex: 1,
                  minWidth: 260,
                  marginBottom: 20,
                  borderRadius: 20,
                  overflow: 'visible',
                  shadowColor: featured ? ACCENT : '#000',
                  shadowOpacity: featured ? 0.22 : 0.08,
                  shadowRadius: featured ? 18 : 10,
                  shadowOffset: { width: 0, height: featured ? 8 : 4 },
                  elevation: featured ? 8 : 3,
                }}
              >
                {/* Most Popular badge */}
                {featured && (
                  <View style={{
                    position: 'absolute', top: -13, alignSelf: 'center', zIndex: 10,
                    backgroundColor: ORANGE, borderRadius: 20,
                    paddingHorizontal: 18, paddingVertical: 5,
                    shadowColor: ORANGE, shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
                  }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }}>⭐ Most Popular</Text>
                  </View>
                )}

                <View style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  borderWidth: featured ? 2 : 1,
                  borderColor: featured ? ACCENT : '#E0E6EE',
                }}>
                  {/* Card header */}
                  <View style={{
                    backgroundColor: featured ? ACCENT : '#fff',
                    paddingHorizontal: 24, paddingTop: featured ? 28 : 22, paddingBottom: 20,
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View>
                        <Text style={{ fontSize: 20, fontWeight: '800', color: featured ? '#fff' : PRIMARY, marginBottom: 4 }}>
                          {plan.name}
                        </Text>
                        {isCurrentPlan && (
                          <View style={{ backgroundColor: featured ? 'rgba(255,255,255,0.2)' : '#EAFAF1', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' }}>
                            <Text style={{ fontSize: 11, fontWeight: '700', color: featured ? '#fff' : GREEN }}>Current Plan</Text>
                          </View>
                        )}
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                          <Text style={{ fontSize: 13, fontWeight: '700', color: featured ? 'rgba(255,255,255,0.8)' : '#888' }}>GH₵</Text>
                          <Text style={{ fontSize: 32, fontWeight: '900', color: featured ? '#fff' : ACCENT, lineHeight: 36 }}>
                            {(plan.amountInPesewas / 100).toFixed(0)}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 12, color: featured ? 'rgba(255,255,255,0.65)' : '#999' }}>/month</Text>
                      </View>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={{ height: 1, backgroundColor: featured ? 'rgba(255,255,255,0.15)' : '#EEF1F6' }} />

                  {/* Features */}
                  <View style={{
                    backgroundColor: featured ? ACCENT : '#fff',
                    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8,
                  }}>
                    {plan.features.map((feature, i) => (
                      <FeatureRow key={i} text={feature} inverted={featured} />
                    ))}
                  </View>

                  {/* Subscribe button */}
                  <View style={{
                    backgroundColor: featured ? ACCENT : '#fff',
                    paddingHorizontal: 24, paddingBottom: 24, paddingTop: 4,
                  }}>
                    <TouchableOpacity
                      onPress={() => !isCurrentPlan && handleSubscribe(plan.tier)}
                      disabled={isCurrentPlan || (initiating && selectedPlan !== plan.tier)}
                      style={{
                        borderRadius: 12,
                        paddingVertical: 14,
                        alignItems: 'center',
                        backgroundColor: isCurrentPlan
                          ? (featured ? 'rgba(255,255,255,0.15)' : '#F0F3F8')
                          : featured ? '#fff' : ACCENT,
                        borderWidth: isCurrentPlan ? 1.5 : 0,
                        borderColor: featured ? 'rgba(255,255,255,0.4)' : '#D0D9E4',
                        opacity: (initiating && selectedPlan !== plan.tier) ? 0.5 : 1,
                      }}
                    >
                      {initiating && selectedPlan === plan.tier ? (
                        <Text style={{ fontSize: 14, fontWeight: '700', color: featured ? ACCENT : '#fff' }}>Processing…</Text>
                      ) : (
                        <Text style={{
                          fontSize: 15, fontWeight: '700',
                          color: isCurrentPlan
                            ? (featured ? 'rgba(255,255,255,0.7)' : '#999')
                            : featured ? ACCENT : '#fff',
                        }}>
                          {isCurrentPlan ? 'Current Plan' : 'Subscribe'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
          </View>

          <Text style={{ fontSize: 12, color: '#B0BAC7', textAlign: 'center', lineHeight: 18, marginTop: 4 }}>
            Payments processed securely by Paystack. Subscriptions auto-renew monthly.{'\n'}Cancel anytime by contacting support.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
