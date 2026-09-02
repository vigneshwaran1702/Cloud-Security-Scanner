import { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext(null);

export const PLAN_TIERS = {
  FREE: {
    id: 'free',
    name: 'Starter Cloud Shield',
    price: 0,
    priceMonthly: 0,
    priceYearly: 0,
    badge: 'Free Tier',
    description: 'Basic vulnerability scanning for personal projects and small sandboxes.',
    features: {
      safeProduction: false,
      instantHelp: false,
      riskContributionMatrix: false,
      autoRemediation: false,
      unlimitedCloudAccounts: false,
      complianceReports: false,
      realtimeDrift: false,
      maxAccounts: 1,
      scanFrequency: 'Manual / 24h',
      supportTier: 'Community'
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro Cloud Defender',
    price: 39,
    priceMonthly: 39,
    priceYearly: 390, // $32.5/mo
    badge: 'Most Popular',
    description: 'Autonomous multi-cloud security with automated safe production fixes, 24/7 instant AI SecOps help, and deep risk contribution analytics.',
    features: {
      safeProduction: true,
      instantHelp: true,
      riskContributionMatrix: true,
      autoRemediation: true,
      unlimitedCloudAccounts: true,
      complianceReports: true,
      realtimeDrift: true,
      maxAccounts: 'Unlimited',
      scanFrequency: 'Continuous Real-time',
      supportTier: '24/7 Priority AI SecOps Hotline'
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise Cloud Fortress',
    price: 99,
    priceMonthly: 99,
    priceYearly: 990,
    badge: 'Enterprise',
    description: 'Custom governance, dedicated security architect, custom SIEM pipelines and 99.99% safe production SLA.',
    features: {
      safeProduction: true,
      instantHelp: true,
      riskContributionMatrix: true,
      autoRemediation: true,
      unlimitedCloudAccounts: true,
      complianceReports: true,
      realtimeDrift: true,
      maxAccounts: 'Unlimited + Dedicated VPC',
      scanFrequency: 'Sub-second Continuous',
      supportTier: 'Dedicated Security Architect + TAM'
    }
  }
};

export function SubscriptionProvider({ children }) {
  const [currentPlan, setCurrentPlan] = useState(() => {
    try {
      const savedPlan = localStorage.getItem('cg_subscription_plan');
      return savedPlan ? JSON.parse(savedPlan) : {
        tierId: 'free',
        billingCycle: 'monthly',
        subscribedAt: null,
        expiresAt: null,
        autoRenew: true,
        paymentMethod: null,
      };
    } catch (e) {
      return {
        tierId: 'free',
        billingCycle: 'monthly',
        subscribedAt: null,
        expiresAt: null,
        autoRenew: true,
        paymentMethod: null,
      };
    }
  });

  const [invoices, setInvoices] = useState(() => {
    try {
      const savedInvoices = localStorage.getItem('cg_subscription_invoices');
      return savedInvoices ? JSON.parse(savedInvoices) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cg_subscription_plan', JSON.stringify(currentPlan));
    } catch (e) {}
  }, [currentPlan]);

  useEffect(() => {
    try {
      localStorage.setItem('cg_subscription_invoices', JSON.stringify(invoices));
    } catch (e) {}
  }, [invoices]);

  const activeTier = PLAN_TIERS[currentPlan.tierId?.toUpperCase()] || PLAN_TIERS.FREE;
  const isPro = currentPlan.tierId === 'pro' || currentPlan.tierId === 'enterprise';
  const isEnterprise = currentPlan.tierId === 'enterprise';

  const upgradeSubscription = (tierId, billingCycle = 'monthly', paymentDetails = {}) => {
    const targetPlan = PLAN_TIERS[tierId.toUpperCase()] || PLAN_TIERS.PRO;
    const now = new Date();
    const expiry = new Date();
    if (billingCycle === 'yearly') {
      expiry.setFullYear(now.getFullYear() + 1);
    } else {
      expiry.setMonth(now.getMonth() + 1);
    }

    const updatedPlan = {
      tierId: targetPlan.id,
      billingCycle,
      subscribedAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      autoRenew: true,
      paymentMethod: {
        brand: paymentDetails.brand || 'Visa',
        last4: paymentDetails.last4 || '4242',
        exp: paymentDetails.exp || '12/28',
      }
    };

    const newInvoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: now.toISOString().split('T')[0],
      planName: targetPlan.name,
      amount: billingCycle === 'yearly' ? targetPlan.priceYearly : targetPlan.priceMonthly,
      status: 'Paid',
      downloadUrl: '#',
    };

    setCurrentPlan(updatedPlan);
    setInvoices(prev => [newInvoice, ...prev]);
    return { success: true, plan: updatedPlan, invoice: newInvoice };
  };

  const cancelSubscription = () => {
    setCurrentPlan({
      tierId: 'free',
      billingCycle: 'monthly',
      subscribedAt: null,
      expiresAt: null,
      autoRenew: false,
      paymentMethod: null,
    });
  };

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        activeTier,
        isPro,
        isEnterprise,
        invoices,
        upgradeSubscription,
        cancelSubscription,
        PLAN_TIERS,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
