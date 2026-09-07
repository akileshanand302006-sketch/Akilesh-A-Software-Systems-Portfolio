import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Mail, User, MessageSquare, FileText, Loader2, RotateCcw } from 'lucide-react';
import contactService from '../../services/contactService';
import './Contact.css';

/**
 * Contact Component
 * Real production-ready contact form connected to the backend API.
 * Genuine loading, success, and error states with zero simulated success.
 */
export default function Contact() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', _honeypot: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Please enter a valid email.';
    if (!formData.message.trim() || formData.message.trim().length < 10) errs.message = 'Message must be at least 10 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Check honeypot
    if (formData._honeypot) {
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await contactService.sendMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
      });

      if (response && response.success) {
        setStatus('success');
      } else {
        throw new Error(response?.message || 'Unable to deliver message.');
      }
    } catch (err) {
      console.error('[CONTACT FORM ERROR]', err);
      setStatus('error');
      setErrorMessage(
        err.message && !err.message.includes('HTTP 500')
          ? err.message
          : 'Something went wrong while delivering your message. Please try again or contact me directly by email.'
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
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <section id="contact" className="section">
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
              >
                <div className="result-icon-wrap success-icon">
                  <CheckCircle size={38} />
                </div>
                <h3 className="result-title">Message Sent Successfully!</h3>
                <p className="result-description">
                  Thanks for reaching out, <strong>{formData.name}</strong>. Your message has been delivered to my inbox and a confirmation email has been sent to <strong>{formData.email}</strong>.
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
              >
                <div className="result-icon-wrap error-icon">
                  <AlertCircle size={38} />
                </div>
                <h3 className="result-title">Unable to Send Message</h3>
                <p className="result-description">{errorMessage}</p>
                <div className="result-direct-contact">
                  <span>Direct Email:</span>
                  <a href="mailto:akileshanand302006@gmail.com" className="direct-email-link">
                    akileshanand302006@gmail.com
                  </a>
                </div>
                <button
                  type="button"
                  className="glass-button glass-button-primary result-btn"
                  onClick={handleRetry}
                >
                  <RotateCcw size={16} />
                  <span>Try Again</span>
                </button>
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
                    required
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.span className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
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
                    required
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.span className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        {errors.email}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Subject */}
                <div className="form-group">
                  <label htmlFor="contact-subject">
                    <FileText size={16} />
                    Subject <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: 400 }}>(Optional)</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Internship discussion / Project inquiry"
                    disabled={status === 'sending'}
                  />
                </div>

                {/* Message */}
                <div className={`form-group ${errors.message ? 'has-error' : ''}`}>
                  <label htmlFor="contact-message">
                    <MessageSquare size={16} />
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hi Akilesh, I'd like to talk about..."
                    disabled={status === 'sending'}
                    required
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.span className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
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
