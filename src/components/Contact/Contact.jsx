import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Mail, User, MessageSquare, FileText, Loader2, RotateCcw } from 'lucide-react';
import contactService from '../../services/contactService';
import './Contact.css';

const OWNER_EMAIL = 'akileshanand302006@gmail.com';

/**
 * Contact Component
 * Liquid Glass contact form powered by Node.js/Express backend,
 * Nodemailer Gmail SMTP delivery, and direct mailto fallback.
 */
export default function Contact() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _honeypot: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const lastSubmitTime = useRef(0);

  const validate = () => {
    const errs = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    // 1. Name validation (Required, min 2 characters, max 100 characters)
    if (!trimmedName) {
      errs.name = 'Name is required.';
    } else if (trimmedName.length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    } else if (trimmedName.length > 100) {
      errs.name = 'Name cannot exceed 100 characters.';
    }

    // 2. Email validation (Required, valid RFC format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errs.email = 'Email is required.';
    } else if (!emailRegex.test(trimmedEmail)) {
      errs.email = 'Please enter a valid email address.';
    }

    // 3. Subject validation (Required, min 2 characters, max 150 characters)
    if (!trimmedSubject) {
      errs.subject = 'Subject is required.';
    } else if (trimmedSubject.length < 2) {
      errs.subject = 'Subject must be at least 2 characters.';
    } else if (trimmedSubject.length > 150) {
      errs.subject = 'Subject cannot exceed 150 characters.';
    }

    // 4. Message validation (Required, 10-2000 characters)
    if (!trimmedMessage) {
      errs.message = 'Message is required.';
    } else if (trimmedMessage.length < 10) {
      errs.message = 'Message must be at least 10 characters.';
    } else if (trimmedMessage.length > 2000) {
      errs.message = 'Message cannot exceed 2000 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate rapid submissions (minimum 2s throttle)
    const now = Date.now();
    if (now - lastSubmitTime.current < 2000) return;
    lastSubmitTime.current = now;

    if (status === 'sending') return;
    if (!validate()) return;

    // Silent reject for automated spam bots filling hidden honeypot
    if (formData._honeypot) {
      console.warn('[CONTACT] Honeypot triggered.');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      // Send message to Express backend API (triggers Gmail SMTP delivery and saves to MongoDB Atlas)
      const response = await contactService.sendMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (!response || !response.success) {
        throw new Error(response?.message || 'Server did not accept the request.');
      }

      // Show success state only after server and SMTP confirm delivery
      setStatus('success');
    } catch (err) {
      console.error('[CONTACT API ERROR]', err);
      setStatus('error');

      // Never expose technical browser exceptions (e.g. "Failed to fetch") or internal secrets
      const isTechnicalError =
        !err.message ||
        /fetch|network|econnrefused|failed|abort|timeout|http \d+/i.test(err.message);

      setErrorMessage(
        isTechnicalError
          ? "We couldn't send your message right now. Please try again or contact me directly by email."
          : err.message
      );
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFormData({ name: '', email: '', subject: '', message: '', _honeypot: '' });
    setErrors({});
    setErrorMessage('');
  };

  const handleRetry = () => {
    // Return to form without losing user's entered text
    setStatus('idle');
    setErrorMessage('');
  };

  // Direct mailto fallback link pre-filled with visitor's subject and message
  const directMailtoUrl = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(
    formData.subject ? `Portfolio Contact — ${formData.subject}` : 'New Portfolio Contact'
  )}&body=${encodeURIComponent(
    formData.message
      ? `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      : ''
  )}`;

  return (
    <section id="contact" className="section" aria-label="Contact Section">
      <div className="container-custom">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">Contact</div>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Have an internship opportunity, project collaboration, or question? Send me a message.
          </p>
        </motion.div>

        <motion.div
          className="contact-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            {/* SUCCESS STATE */}
            {status === 'success' && (
              <motion.div
                key="contact-success"
                className="contact-result-card glass-panel success-card"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                role="status"
                aria-live="polite"
              >
                <div className="result-icon-wrap success-icon">
                  <CheckCircle size={38} />
                </div>
                <h3 className="result-title">Message Sent Successfully!</h3>
                <p className="result-description">
                  Thank you, <strong>{formData.name}</strong>. Your message has been delivered to <strong>{OWNER_EMAIL}</strong>.
                </p>
                <p className="result-subtext">I will review your message and get back to you as soon as possible.</p>
                <button
                  type="button"
                  className="glass-button glass-button-primary result-btn"
                  onClick={handleReset}
                >
                  <Send size={16} />
                  <span>Send Another Message</span>
                </button>
              </motion.div>
            )}

            {/* ERROR STATE */}
            {status === 'error' && (
              <motion.div
                key="contact-error"
                className="contact-result-card glass-panel error-card"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                role="alert"
                aria-live="assertive"
              >
                <div className="result-icon-wrap error-icon">
                  <AlertCircle size={38} />
                </div>
                <h3 className="result-title">Unable to Send Message</h3>
                <p className="result-description">{errorMessage}</p>

                {/* Direct mailto fallback */}
                <div className="result-direct-contact">
                  <span>Send Directly:</span>
                  <a href={directMailtoUrl} className="direct-email-link" title="Open in default email app">
                    {OWNER_EMAIL}
                  </a>
                </div>

                <div className="result-actions-row">
                  <button
                    type="button"
                    className="glass-button glass-button-secondary result-btn"
                    onClick={handleRetry}
                  >
                    <RotateCcw size={16} />
                    <span>Try Again</span>
                  </button>
                  <a
                    href={directMailtoUrl}
                    className="glass-button glass-button-primary result-btn"
                  >
                    <Mail size={16} />
                    <span>Open Email App</span>
                  </a>
                </div>
              </motion.div>
            )}

            {/* FORM STATE (idle & sending) */}
            {(status === 'idle' || status === 'sending') && (
              <motion.form
                key="contact-form"
                ref={formRef}
                className="contact-form glass-panel"
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Anti-spam Honeypot */}
                <input
                  type="text"
                  name="_honeypot"
                  value={formData._honeypot}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {/* Name */}
                <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                  <label htmlFor="contact-name">
                    <User size={16} />
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="name"
                    disabled={status === 'sending'}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    required
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.span
                        id="contact-name-error"
                        className="form-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {errors.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email */}
                <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                  <label htmlFor="contact-email">
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    autoComplete="email"
                    disabled={status === 'sending'}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    required
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.span
                        id="contact-email-error"
                        className="form-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {errors.email}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Subject */}
                <div className={`form-group ${errors.subject ? 'has-error' : ''}`}>
                  <label htmlFor="contact-subject">
                    <FileText size={16} />
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Internship discussion / Project inquiry"
                    disabled={status === 'sending'}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                    required
                  />
                  <AnimatePresence>
                    {errors.subject && (
                      <motion.span
                        id="contact-subject-error"
                        className="form-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {errors.subject}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Message */}
                <div className={`form-group ${errors.message ? 'has-error' : ''}`}>
                  <div className="message-label-row">
                    <label htmlFor="contact-message">
                      <MessageSquare size={16} />
                      Message
                    </label>
                    <span className="char-counter" aria-live="polite">
                      {formData.message.length}/2000
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    maxLength={2000}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hi Akilesh, I'd like to talk about..."
                    disabled={status === 'sending'}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    required
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.span
                        id="contact-message-error"
                        className="form-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {errors.message}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="glass-button glass-button-primary contact-submit"
                  disabled={status === 'sending'}
                  aria-busy={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
