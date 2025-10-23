// Meauxbility Footer JavaScript - For Render Static Site Integration

(function() {
  'use strict';

  // Theme Management
  const darkModePages = ['about', 'community', 'resources'];
  const lightModePages = ['programs', 'donate', 'home'];

  function initializeTheme() {
    const currentPath = window.location.pathname;
    const savedTheme = localStorage.getItem('meauxbility-theme');
    let pageTheme = null;

    darkModePages.forEach(page => {
      if (currentPath.includes(page)) pageTheme = 'dark';
    });

    lightModePages.forEach(page => {
      if (currentPath.includes(page) || currentPath === '/') pageTheme = 'light';
    });

    const html = document.documentElement;
    if (savedTheme) {
      html.setAttribute('data-theme', savedTheme);
    } else if (pageTheme) {
      html.setAttribute('data-theme', pageTheme);
    }
  }

  // 3D Model Performance Management
  let modelVisible = false;
  const modelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const modelViewer = entry.target.querySelector('model-viewer');
      if (modelViewer) {
        if (entry.isIntersecting && !modelVisible) {
          modelVisible = true;
          modelViewer.setAttribute('auto-rotate', '');
        } else if (!entry.isIntersecting && modelVisible) {
          modelVisible = false;
          modelViewer.removeAttribute('auto-rotate');
        }
      }
    });
  }, { threshold: 0.1 });

  // Payment Controller
  class MbxPaymentController {
    constructor() {
      this.amount = 250;
      this.frequency = 'one_time';
      this.stripe = null;
      this.elements = null;
      this.card = null;
      this.init();
    }

    async init() {
      if (typeof Stripe !== 'undefined') {
        this.stripe = Stripe('pk_live_51S4R0SRW56Pm3uYI8EKbysm1ok4peVXSD6G17HtFy8BDuG9Carn8Ry7iPVzulMBtdEFcz5pFvXpE04CIgn8PY6WS00aXOqMYEI');
        this.elements = this.stripe.elements();
        this.card = this.elements.create('card', {
          style: {
            base: {
              fontSize: '14px',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              '::placeholder': {
                color: 'rgba(255,255,255,0.5)'
              }
            }
          }
        });
        
        const cardElement = document.getElementById('mbx-card-element');
        if (cardElement && !cardElement.hasChildNodes()) {
          this.card.mount('#mbx-card-element');
        }
        
        this.card.on('change', (event) => {
          const errorElement = document.getElementById('mbxCardErr');
          if (event.error) {
            errorElement.textContent = event.error.message;
            errorElement.classList.add('show');
          } else {
            errorElement.classList.remove('show');
          }
        });
      }
    }

    open() {
      const cardElement = document.getElementById('mbx-card-element');
      if (this.card && cardElement && !cardElement.hasChildNodes()) {
        this.card.mount('#mbx-card-element');
      }
      
      const backdrop = document.getElementById('mbxModalBackdrop');
      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    close() {
      const backdrop = document.getElementById('mbxModalBackdrop');
      backdrop.classList.remove('active');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      this.reset();
    }

    selectAmount(amt) {
      this.amount = amt;
      document.querySelectorAll('.mbx-amount-btn').forEach(btn => btn.classList.remove('selected'));
      if (event && event.target) {
        event.target.classList.add('selected');
      }
      document.querySelector('.mbx-custom-amount').value = '';
    }

    selectCustom(val) {
      if (val && val > 0) {
        this.amount = parseFloat(val);
        document.querySelectorAll('.mbx-amount-btn').forEach(btn => btn.classList.remove('selected'));
      }
    }

    setFrequency(type) {
      this.frequency = type;
      document.querySelectorAll('.mbx-frequency-btn').forEach(btn => btn.classList.remove('active'));
      if (event && event.target) {
        event.target.classList.add('active');
      }
    }

    validate() {
      let valid = true;
      
      ['mbxFirstName', 'mbxLastName', 'mbxEmail'].forEach(id => {
        const field = document.getElementById(id);
        const error = document.getElementById(id + 'Err');
        
        if (!field.value.trim()) {
          error.classList.add('show');
          valid = false;
        } else {
          error.classList.remove('show');
        }
      });
      
      const email = document.getElementById('mbxEmail');
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        document.getElementById('mbxEmailErr').classList.add('show');
        valid = false;
      }
      
      return valid;
    }

    async process() {
      if (!this.validate()) return;
      
      const button = document.querySelector('.mbx-donate-submit');
      const text = document.querySelector('.mbx-submit-text');
      const loading = document.getElementById('mbxLoading');
      
      button.disabled = true;
      text.style.display = 'none';
      loading.classList.add('active');
      
      try {
        const response = await fetch('https://shhh-ox7c.onrender.com/donations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': `don_${Date.now()}_${Math.random()}`
          },
          body: JSON.stringify({
            fund: document.getElementById('mbxDesignation').value,
            frequency: this.frequency,
            amount: this.amount,
            currency: 'usd',
            metadata: {
              firstName: document.getElementById('mbxFirstName').value,
              lastName: document.getElementById('mbxLastName').value,
              email: document.getElementById('mbxEmail').value
            }
          })
        });
        
        const { clientSecret } = await response.json();
        
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.card,
            billing_details: {
              name: `${document.getElementById('mbxFirstName').value} ${document.getElementById('mbxLastName').value}`,
              email: document.getElementById('mbxEmail').value
            }
          }
        });
        
        if (error) throw new Error(error.message);
        
        if (paymentIntent.status === 'succeeded') {
          this.showSuccess();
        }
      } catch (error) {
        alert(`Payment failed: ${error.message}`);
      } finally {
        button.disabled = false;
        text.style.display = 'inline';
        loading.classList.remove('active');
      }
    }

    showSuccess() {
      document.getElementById('mbxSuccessMsg').classList.add('show');
      setTimeout(() => this.close(), 3000);
    }

    reset() {
      document.querySelectorAll('.mbx-form-input').forEach(input => input.value = '');
      document.querySelectorAll('.mbx-error').forEach(error => error.classList.remove('show'));
      document.getElementById('mbxSuccessMsg').classList.remove('show');
      if (this.card) this.card.clear();
    }
  }

  // Global Functions
  let mbxPayment = null;

  window.openDonateModal = () => {
    if (!mbxPayment) mbxPayment = new MbxPaymentController();
    mbxPayment.open();
  };

  window.closeDonateModal = () => {
    if (mbxPayment) mbxPayment.close();
  };

  window.selectMbxAmount = (amt) => {
    if (mbxPayment) mbxPayment.selectAmount(amt);
  };

  window.selectMbxCustom = (val) => {
    if (mbxPayment) mbxPayment.selectCustom(val);
  };

  window.setMbxFrequency = (type) => {
    if (mbxPayment) mbxPayment.setFrequency(type);
  };

  window.processMbxDonation = () => {
    if (mbxPayment) mbxPayment.process();
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    
    const yearElement = document.getElementById('mbx-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // Observe 3D model
    const modelContainer = document.querySelector('.mbx-3d-accent');
    if (modelContainer) {
      modelObserver.observe(modelContainer);
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('mbx-newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = e.target.querySelector('.mbx-newsletter-input').value;
        alert(`Thank you for subscribing with ${email}!`);
        e.target.reset();
      });
    }

    mbxPayment = new MbxPaymentController();

    // Backdrop click to close
    document.getElementById('mbxModalBackdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeDonateModal();
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const backdrop = document.getElementById('mbxModalBackdrop');
        if (backdrop.classList.contains('active')) {
          closeDonateModal();
        }
      }
    });
  });

})();
