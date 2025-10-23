// Stripe Configuration for Meauxbility
// This file contains all Stripe-related configuration and payment processing

const STRIPE_CONFIG = {
  // Live API Keys (Replace with your actual keys)
  publishableKey: 'pk_live_51S4R0SRW56Pm3uYI8EKbysm1ok4peVXSD6G17HtFy8BDuG9Carn8Ry7iPVzulMBtdEFcz5pFvXpE04CIgn8PY6WS00aXOqMYEI',
  secretKey: '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',
  
  // Test API Keys (for development)
  testPublishableKey: 'pk_test_51S4R0SRW56Pm3uYI8EKbysm1ok4peVXSD6G17HtFy8BDuG9Carn8Ry7iPVzulMBtdEFcz5pFvXpE04CIgn8PY6WS00aXOqMYEI',
  testSecretKey: 'sk_test_51S4R0SRW56Pm3uYI8EKbysm1ok4peVXSD6G17HtFy8BDuG9Carn8Ry7iPVzulMBtdEFcz5pFvXpE04CIgn8PY6WS00aXOqMYEI',
  
  // Environment
  environment: 'live', // 'test' or 'live'
  
  // Webhook endpoints
  webhookEndpoints: {
    donations: 'https://shhh-ox7c.onrender.com/donations',
    subscriptions: 'https://shhh-ox7c.onrender.com/subscriptions',
    webhooks: 'https://shhh-ox7c.onrender.com/webhooks'
  },
  
  // Product configurations
  products: {
    // One-time donations
    donations: {
      general: {
        name: 'General Donation',
        description: 'Support Meauxbility\'s mission',
        defaultAmount: 250
      },
      donmichael: {
        name: 'DonMichael\'s Wheelchair Fund',
        description: 'Help DonMichael get his custom wheelchair',
        defaultAmount: 500
      },
      recovery: {
        name: 'Recovery Grant Program',
        description: 'Support our recovery grant program',
        defaultAmount: 100
      },
      adaptive: {
        name: 'Adaptive Athletes Fund',
        description: 'Support adaptive athletes',
        defaultAmount: 150
      },
      equipment: {
        name: 'Equipment Fund',
        description: 'Help us provide adaptive equipment',
        defaultAmount: 200
      }
    },
    
    // Monthly subscriptions
    subscriptions: {
      supporter: {
        name: 'Monthly Supporter',
        description: 'Monthly support for Meauxbility',
        amount: 25,
        interval: 'month'
      },
      champion: {
        name: 'Monthly Champion',
        description: 'Champion level monthly support',
        amount: 50,
        interval: 'month'
      },
      hero: {
        name: 'Monthly Hero',
        description: 'Hero level monthly support',
        amount: 100,
        interval: 'month'
      }
    }
  },
  
  // Payment methods
  paymentMethods: ['card'],
  
  // Currency
  currency: 'usd',
  
  // Tax settings
  taxSettings: {
    taxDeductible: true,
    ein: '33-4214907',
    organizationName: 'Meauxbility'
  }
};

// Stripe Payment Processor Class
class MeauxbilityStripeProcessor {
  constructor() {
    this.stripe = null;
    this.elements = null;
    this.cardElement = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Load Stripe.js
      if (typeof Stripe === 'undefined') {
        await this.loadStripeScript();
      }
      
      // Initialize Stripe
      const publishableKey = STRIPE_CONFIG.environment === 'live' 
        ? STRIPE_CONFIG.publishableKey 
        : STRIPE_CONFIG.testPublishableKey;
        
      this.stripe = Stripe(publishableKey);
      
      // Create elements
      this.elements = this.stripe.elements({
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#FF6B35',
            colorBackground: '#1a4a52',
            colorText: '#ffffff',
            colorDanger: '#ff6b6b',
            fontFamily: 'Inter, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px'
          }
        }
      });
      
      this.isInitialized = true;
      console.log('✅ Stripe initialized successfully');
      
    } catch (error) {
      console.error('❌ Stripe initialization failed:', error);
      throw error;
    }
  }

  async loadStripeScript() {
    return new Promise((resolve, reject) => {
      if (typeof Stripe !== 'undefined') {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  createCardElement(containerId) {
    if (!this.elements) {
      throw new Error('Stripe elements not initialized');
    }
    
    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#ffffff',
          fontFamily: 'Inter, sans-serif',
          '::placeholder': {
            color: 'rgba(255,255,255,0.5)'
          }
        },
        invalid: {
          color: '#ff6b6b'
        }
      }
    });
    
    this.cardElement.mount(`#${containerId}`);
    
    this.cardElement.on('change', (event) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
        displayError.style.display = 'block';
      } else {
        displayError.style.display = 'none';
      }
    });
    
    return this.cardElement;
  }

  async processDonation(donationData) {
    try {
      // Create payment intent
      const response = await fetch(STRIPE_CONFIG.webhookEndpoints.donations, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `don_${Date.now()}_${Math.random()}`
        },
        body: JSON.stringify({
          amount: donationData.amount * 100, // Convert to cents
          currency: STRIPE_CONFIG.currency,
          fund: donationData.fund,
          frequency: donationData.frequency,
          metadata: {
            firstName: donationData.firstName,
            lastName: donationData.lastName,
            email: donationData.email,
            designation: donationData.designation
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: `${donationData.firstName} ${donationData.lastName}`,
            email: donationData.email
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;

    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  async processSubscription(subscriptionData) {
    try {
      const response = await fetch(STRIPE_CONFIG.webhookEndpoints.subscriptions, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `sub_${Date.now()}_${Math.random()}`
        },
        body: JSON.stringify({
          amount: subscriptionData.amount * 100,
          currency: STRIPE_CONFIG.currency,
          interval: subscriptionData.interval,
          metadata: {
            firstName: subscriptionData.firstName,
            lastName: subscriptionData.lastName,
            email: subscriptionData.email
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { clientSecret } = await response.json();

      const { error, setupIntent } = await this.stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: `${subscriptionData.firstName} ${subscriptionData.lastName}`,
            email: subscriptionData.email
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return setupIntent;

    } catch (error) {
      console.error('Subscription processing error:', error);
      throw error;
    }
  }
}

// Global Stripe instance
window.MeauxbilityStripe = new MeauxbilityStripeProcessor();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STRIPE_CONFIG, MeauxbilityStripeProcessor };
}
