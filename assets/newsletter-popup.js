const NEWSLETTER_POPUP_KEY = 'swaysculpt:newsletter-popup';
const NEWSLETTER_POPUP_SUBMIT_KEY = 'swaysculpt:newsletter-popup:submitting';

class NewsletterPopup extends HTMLElement {
  constructor() {
    super();
    this.dialog = this.querySelector('.newsletter-popup__dialog');
    this.timer = null;
    this.onKeydown = this.onKeydown.bind(this);
  }

  connectedCallback() {
    // Close interactions
    this.querySelectorAll('[data-popup-close], [data-popup-overlay]').forEach((el) =>
      el.addEventListener('click', () => this.close())
    );

    // Flag our own form submit so we can distinguish it from other customer forms on reload.
    const form = this.querySelector('form');
    if (form) {
      form.addEventListener('submit', () => {
        try {
          sessionStorage.setItem(NEWSLETTER_POPUP_SUBMIT_KEY, '1');
        } catch (e) {}
      });
    }

    // In the theme editor: always show for styling, never persist state.
    if (window.Shopify && window.Shopify.designMode) {
      this.open();
      return;
    }

    // Just subscribed via this popup → confirm + reveal code, then remember forever.
    // Shopify reloads with ?customer_posted=true on a successful customer-form submit; the
    // session flag confirms it was *our* form (not the footer/newsletter form).
    const urlPosted = new URLSearchParams(window.location.search).get('customer_posted') === 'true';
    if (urlPosted && this.wasSubmittedByPopup()) {
      this.clearSubmitFlag();
      this.setState({ subscribed: true });
      this.open();
      return;
    }

    if (!this.shouldShow()) return;

    const delay = (parseInt(this.dataset.delay, 10) || 0) * 1000;
    this.timer = setTimeout(() => this.open(), delay);
  }

  shouldShow() {
    const state = this.getState();
    if (state.subscribed) return false;
    if (state.dismissedAt) {
      const days = parseInt(this.dataset.suppressDays, 10) || 30;
      const elapsed = Date.now() - state.dismissedAt;
      if (elapsed < days * 24 * 60 * 60 * 1000) return false;
    }
    return true;
  }

  open() {
    if (this.timer) clearTimeout(this.timer);
    this.removeAttribute('hidden');
    document.body.classList.add('overflow-hidden');
    // Defer to next frame so the entrance transition runs.
    requestAnimationFrame(() => this.setAttribute('open', ''));
    document.addEventListener('keydown', this.onKeydown);
    const signup = this.querySelector('.newsletter-popup__signup');
    const emailInput = this.querySelector('input[type="email"]');
    const focusTarget = signup && !signup.hidden && emailInput ? emailInput : this.dialog;
    if (typeof trapFocus === 'function') {
      trapFocus(this.dialog, focusTarget);
    } else {
      focusTarget.focus();
    }
  }

  close() {
    if (this.timer) clearTimeout(this.timer);
    this.removeAttribute('open');
    document.body.classList.remove('overflow-hidden');
    document.removeEventListener('keydown', this.onKeydown);
    if (typeof removeTrapFocus === 'function') removeTrapFocus();

    // Record dismissal (unless they already subscribed, and never in design mode).
    if (window.Shopify && window.Shopify.designMode) {
      this.setAttribute('hidden', '');
      return;
    }
    const state = this.getState();
    if (!state.subscribed) this.setState({ dismissedAt: Date.now() });
    setTimeout(() => this.setAttribute('hidden', ''), 300);
  }

  onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  wasSubmittedByPopup() {
    try {
      return sessionStorage.getItem(NEWSLETTER_POPUP_SUBMIT_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  clearSubmitFlag() {
    try {
      sessionStorage.removeItem(NEWSLETTER_POPUP_SUBMIT_KEY);
    } catch (e) {}
  }

  getState() {
    try {
      return JSON.parse(localStorage.getItem(NEWSLETTER_POPUP_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  setState(patch) {
    try {
      const next = Object.assign(this.getState(), patch);
      localStorage.setItem(NEWSLETTER_POPUP_KEY, JSON.stringify(next));
    } catch (e) {}
  }
}

customElements.define('newsletter-popup', NewsletterPopup);
