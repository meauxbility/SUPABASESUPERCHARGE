/**
 * ModalManager - Custom HTML Modal System
 * Designed for Shopify integration with future independence
 */

class ModalManager {
  constructor() {
    this.modals = new Map();
    this.activeModal = null;
    this.zIndex = 1000;
    this.init();
  }

  /**
   * Initialize modal system
   */
  init() {
    this.createModalContainer();
    this.bindEvents();
    console.log('ModalManager initialized');
  }

  /**
   * Create modal container in DOM
   */
  createModalContainer() {
    if (document.getElementById('modal-container')) return;
    
    const container = document.createElement('div');
    container.id = 'modal-container';
    container.className = 'modal-container';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);
  }

  /**
   * Create a new modal
   * @param {Object} config - Modal configuration
   */
  createModal(config) {
    const modalId = config.id || `modal-${Date.now()}`;
    
    const modal = {
      id: modalId,
      title: config.title || 'Modal',
      content: config.content || '',
      type: config.type || 'default',
      size: config.size || 'medium',
      closable: config.closable !== false,
      backdrop: config.backdrop !== false,
      animation: config.animation || 'fade',
      apiEndpoint: config.apiEndpoint || null,
      onOpen: config.onOpen || null,
      onClose: config.onClose || null,
      onSubmit: config.onSubmit || null
    };

    this.modals.set(modalId, modal);
    this.renderModal(modal);
    
    return modalId;
  }

  /**
   * Render modal HTML
   * @param {Object} modal - Modal object
   */
  renderModal(modal) {
    const container = document.getElementById('modal-container');
    const modalHTML = this.generateModalHTML(modal);
    
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    modalElement.className = `modal-wrapper ${modal.type}`;
    modalElement.id = `modal-${modal.id}`;
    modalElement.setAttribute('data-modal-id', modal.id);
    
    container.appendChild(modalElement);
  }

  /**
   * Generate modal HTML structure
   * @param {Object} modal - Modal object
   */
  generateModalHTML(modal) {
    return `
      <div class="modal-backdrop" data-modal-id="${modal.id}"></div>
      <div class="modal-dialog modal-${modal.size}" role="dialog" aria-labelledby="modal-title-${modal.id}" aria-modal="true">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="modal-title-${modal.id}">${modal.title}</h3>
            ${modal.closable ? '<button class="modal-close" aria-label="Close modal">&times;</button>' : ''}
          </div>
          <div class="modal-body">
            ${modal.content}
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary modal-cancel">Cancel</button>
            <button class="btn btn-primary modal-submit">Submit</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Show modal
   * @param {string} modalId - Modal ID
   */
  showModal(modalId) {
    const modal = this.modals.get(modalId);
    if (!modal) {
      console.error(`Modal ${modalId} not found`);
      return;
    }

    const modalElement = document.getElementById(`modal-${modalId}`);
    if (!modalElement) {
      console.error(`Modal element ${modalId} not found`);
      return;
    }

    // Hide any active modal
    if (this.activeModal) {
      this.hideModal(this.activeModal);
    }

    // Show new modal
    this.activeModal = modalId;
    modalElement.style.display = 'block';
    modalElement.setAttribute('aria-hidden', 'false');
    
    // Add animation class
    setTimeout(() => {
      modalElement.classList.add('modal-show');
    }, 10);

    // Focus management
    this.trapFocus(modalElement);

    // Call onOpen callback
    if (modal.onOpen) {
      modal.onOpen(modal);
    }

    console.log(`Modal ${modalId} shown`);
  }

  /**
   * Hide modal
   * @param {string} modalId - Modal ID
   */
  hideModal(modalId) {
    const modal = this.modals.get(modalId);
    if (!modal) return;

    const modalElement = document.getElementById(`modal-${modalId}`);
    if (!modalElement) return;

    // Remove animation class
    modalElement.classList.remove('modal-show');
    
    // Wait for animation to complete
    setTimeout(() => {
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      
      if (this.activeModal === modalId) {
        this.activeModal = null;
      }

      // Call onClose callback
      if (modal.onClose) {
        modal.onClose(modal);
      }

      console.log(`Modal ${modalId} hidden`);
    }, 300);
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Close modal on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        const modalId = e.target.getAttribute('data-modal-id');
        this.hideModal(modalId);
      }
    });

    // Close modal on close button click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-close')) {
        const modalId = e.target.closest('[data-modal-id]').getAttribute('data-modal-id');
        this.hideModal(modalId);
      }
    });

    // Close modal on cancel button click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-cancel')) {
        const modalId = e.target.closest('[data-modal-id]').getAttribute('data-modal-id');
        this.hideModal(modalId);
      }
    });

    // Handle modal submit
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-submit')) {
        const modalId = e.target.closest('[data-modal-id]').getAttribute('data-modal-id');
        this.handleSubmit(modalId);
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.hideModal(this.activeModal);
      }
    });
  }

  /**
   * Handle modal submit
   * @param {string} modalId - Modal ID
   */
  async handleSubmit(modalId) {
    const modal = this.modals.get(modalId);
    if (!modal) return;

    try {
      // Collect form data
      const formData = this.collectFormData(modalId);
      
      // Call onSubmit callback
      if (modal.onSubmit) {
        await modal.onSubmit(formData, modal);
      }

      // Handle API submission if endpoint provided
      if (modal.apiEndpoint) {
        await this.submitToAPI(modal.apiEndpoint, formData);
      }

      // Close modal after successful submission
      this.hideModal(modalId);
      
    } catch (error) {
      console.error('Modal submit error:', error);
      // Handle error (show message, etc.)
    }
  }

  /**
   * Collect form data from modal
   * @param {string} modalId - Modal ID
   */
  collectFormData(modalId) {
    const modalElement = document.getElementById(`modal-${modalId}`);
    const form = modalElement.querySelector('form');
    
    if (!form) return {};

    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }

  /**
   * Submit data to API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Form data
   */
  async submitToAPI(endpoint, data) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API submission error:', error);
      throw error;
    }
  }

  /**
   * Trap focus within modal
   * @param {HTMLElement} modalElement - Modal element
   */
  trapFocus(modalElement) {
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (firstElement) {
      firstElement.focus();
    }

    // Handle tab navigation
    modalElement.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  /**
   * Destroy modal
   * @param {string} modalId - Modal ID
   */
  destroyModal(modalId) {
    const modal = this.modals.get(modalId);
    if (!modal) return;

    const modalElement = document.getElementById(`modal-${modalId}`);
    if (modalElement) {
      modalElement.remove();
    }

    this.modals.delete(modalId);
    
    if (this.activeModal === modalId) {
      this.activeModal = null;
    }

    console.log(`Modal ${modalId} destroyed`);
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModalManager;
}

// Global access for browser
if (typeof window !== 'undefined') {
  window.ModalManager = ModalManager;
}
