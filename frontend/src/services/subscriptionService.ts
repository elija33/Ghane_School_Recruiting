import api from './api';
import { PaystackInitResponse, Subscription, SubscriptionTier } from '../types';

export const subscriptionService = {
  async initializeSubscription(payload: { plan: string; email: string }): Promise<PaystackInitResponse> {
    const { data } = await api.post<PaystackInitResponse>('/subscriptions/initialize', payload);
    return data;
  },

  async verifySubscription(payload: { reference: string }): Promise<Subscription> {
    const { data } = await api.post<Subscription>('/subscriptions/verify', payload);
    return data;
  },

  async getSubscriptionStatus(): Promise<Subscription> {
    const { data } = await api.get<Subscription>('/subscriptions/status');
    return data;
  },
};

export const SUBSCRIPTION_PLANS: {
  tier: SubscriptionTier;
  name: string;
  amountInPesewas: number;
  recommended: boolean;
  features: string[];
}[] = [
  {
    tier: 'BASIC',
    name: 'Basic',
    amountInPesewas: 20000,   // GH₵200.00
    recommended: false,
    features: [
      'Post up to 5 job listings',
      'Browse verified teacher profiles',
      'View teacher CVs and photos',
      'Email support',
    ],
  },
  {
    tier: 'STANDARD',
    name: 'Standard',
    amountInPesewas: 50000,   // GH₵500.00
    recommended: true,
    features: [
      'Post up to 20 job listings',
      'Browse all verified teacher profiles',
      'View CVs, photos, and screening videos',
      'Priority email support',
      'Application tracking',
    ],
  },
  {
    tier: 'ENTERPRISE',
    name: 'Enterprise',
    amountInPesewas: 120000,  // GH₵1,200.00
    recommended: false,
    features: [
      'Unlimited job listings',
      'Full access to all teacher profiles',
      'Dedicated account manager',
      'Custom screening criteria',
      'Bulk application management',
      'Analytics dashboard',
      'Phone & email support',
    ],
  },
];
