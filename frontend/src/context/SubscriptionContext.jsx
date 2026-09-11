import { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext(null);

export const PLAN_TIERS = {
  FREE: {
    id: 'free',
    name: 'Starter Cloud Shield',
    price: 0,
    priceTotal: 0,
    period: 'Forever Free',
    durationMonths: 0,
    badge: 'Free Tier',
    description: 'Essential multi-cloud posture checks and security reviews for every registered user.',
    features: {
      safeProduction: false,
      instantHelp: false,
      riskContributionMatrix: false,
      autoRemediation: false,
      unlimitedCloudAccounts: false,
      complianceReports: false,
      realtimeDrift: false,
      maxAccounts: 1,
      scanFrequency: 'Manual / On-demand',
      supportTier: 'Community'
    }
  },
  MONTHLY: {
    id: 'monthly',
    name: '1 Month Pro Shield',
    price: 19,
    priceTotal: 19,
    period: '1 Month',
    durationMonths: 1,
    badge: 'Monthly Plan',
    description: 'Full automated CIS compliance, production safe fixes, 24/7 AI SecOps assistant, and real-time drift alerts.',
    features: {
      safeProduction: true,
      instantHelp: true,
      riskContributionMatrix: true,
      autoRemediation: true,
      unlimitedCloudAccounts: true,
      complianceReports: true,
      realtimeDrift: true,
      maxAccounts: 'Multi-Cloud (3 Accounts)',
      scanFrequency: 'Continuous Real-time',
      supportTier: '24/7 AI SecOps Assistant'
    }
  },
  QUARTERLY: {
    id: 'quarterly',
    name: '3 Months Pro Defender',
    price: 39,
    priceTotal: 39,
    period: '3 Months',
    durationMonths: 3,
    badge: 'Most Popular / Best Value',
    description: '3-Month all-inclusive defense with automated safe production fixes, unlimited accounts, and priority AI SecOps hotline.',
    features: {
      safeProduction: true,
      instantHelp: true,
      riskContributionMatrix: true,
      autoRemediation: true,
      unlimitedCloudAccounts: true,
      complianceReports: true,
      realtimeDrift: true,
      maxAccounts: 'Unlimited Accounts',
      scanFrequency: 'Continuous Real-time',
      supportTier: 'Priority 24/7 AI SecOps Hotline'
    }
  },
  YEARLY: {
    id: 'yearly',
    name: '1 Year Enterprise Fortress',
    price: 149,
    priceTotal: 149,
    period: '1 Year',
    durationMonths: 12,
    badge: 'Maximum Savings',
    description: 'Comprehensive annual fortress protection with dedicated compliance reporting, SIEM exports, and unlimited cloud assets.',
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
      supportTier: 'Dedicated Security Architect'
    }
  }
};

// Aliases for backward compatibility
PLAN_TIERS.PRO = PLAN_TIERS.QUARTERLY;
PLAN_TIERS.ENTERPRISE = PLAN_TIERS.YEARLY;

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
  const isPro = currentPlan.tierId !== 'free';
  const isEnterprise = currentPlan.tierId === 'yearly' || currentPlan.tierId === 'enterprise';

  const upgradeSubscription = (tierId, billingCycle = 'monthly', paymentDetails = {}) => {
    const targetPlan = PLAN_TIERS[tierId.toUpperCase()] || PLAN_TIERS.QUARTERLY;
    const now = new Date();
    const expiry = new Date();
    const monthsToAdd = targetPlan.durationMonths || 1;
    expiry.setMonth(now.getMonth() + monthsToAdd);

    const transactionId = paymentDetails.transactionId || `TXN-${Date.now().toString().slice(-8)}`;
    const invoiceId = paymentDetails.invoiceId || `INV-${Date.now().toString().slice(-6)}`;

    const updatedPlan = {
      tierId: targetPlan.id,
      billingCycle: targetPlan.period,
      subscribedAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      autoRenew: true,
      paymentMethod: {
        type: paymentDetails.type || 'card',
        brand: paymentDetails.brand || 'Visa',
        last4: paymentDetails.last4 || '4242',
        exp: paymentDetails.exp || '12/28',
        cardHolder: paymentDetails.cardHolder || 'Authorized User',
        upiId: paymentDetails.upiId || null,
        utr: paymentDetails.utr || null,
        walletAddress: paymentDetails.walletAddress || null,
        network: paymentDetails.network || null,
        txHash: paymentDetails.txHash || null,
        transactionId,
        invoiceId,
        amount: paymentDetails.amount || targetPlan.price,
      }
    };

    const purchaseTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const purchaseDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    let methodLabel = 'Credit Card';
    if (paymentDetails.type === 'upi') {
      methodLabel = `UPI (VPA: ${paymentDetails.upiId || 'VPA'})`;
    } else if (paymentDetails.type === 'crypto') {
      methodLabel = `Crypto (${paymentDetails.network ? paymentDetails.network.replace('_', ' ') : 'USDT'})`;
    } else if (paymentDetails.brand) {
      methodLabel = `${paymentDetails.brand} Card (ending in ${paymentDetails.last4 || '4242'})`;
    }

    const newInvoice = {
      id: invoiceId,
      transactionId,
      websiteName: 'CloudGuard AI - Cloud Security Scanner',
      websiteUrl: 'https://cloudguard-secops.ai',
      companyName: 'CloudGuard SecOps Technologies Ltd.',
      date: now.toISOString().split('T')[0],
      createdAt: now.toISOString(),
      purchaseTimestamp: `${purchaseDate} at ${purchaseTime}`,
      formattedDate: purchaseDate,
      formattedTime: purchaseTime,
      planId: targetPlan.id,
      planName: targetPlan.name,
      planPeriod: targetPlan.period,
      planDescription: targetPlan.description || 'Full automated CIS compliance, production safe fixes, and 24/7 AI SecOps assistant.',
      planFeatures: [
        'Safe Production Zero-Downtime Auto-Remediation',
        '24/7 Instant AI SecOps Assistant',
        'Real-time Infrastructure Drift Alerts',
        'Multi-Cloud Account Connections',
        '1-Click Automated Compliance PDF Reports'
      ],
      amount: paymentDetails.amount || targetPlan.price,
      currency: 'USD',
      status: 'Paid & Active',
      paymentMethodType: paymentDetails.type || 'card',
      paymentMethodLabel: methodLabel,
      paymentReference: paymentDetails.utr
        ? `UTR: ${paymentDetails.utr}`
        : paymentDetails.txHash
        ? `TxHash: ${paymentDetails.txHash}`
        : paymentDetails.last4
        ? `Card ending in ${paymentDetails.last4}`
        : transactionId,
      cardHolder: paymentDetails.cardHolder || 'Authorized User',
      upiId: paymentDetails.upiId || null,
      utr: paymentDetails.utr || null,
      walletAddress: paymentDetails.walletAddress || null,
      network: paymentDetails.network || null,
      txHash: paymentDetails.txHash || null,
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
