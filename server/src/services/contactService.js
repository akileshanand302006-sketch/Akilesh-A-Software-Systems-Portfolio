import ContactMessage from '../models/ContactMessage.js';

/**
 * Saves a new contact message and triggers optional notifications.
 */
export async function processContactMessage({ name, email, subject, message, ipAddress, userAgent }) {
  const contact = await ContactMessage.create({
    name,
    email,
    subject,
    message,
    ipAddress,
    userAgent,
    status: 'NEW',
  });

  // Optional: trigger background email notification without blocking client response
  console.log(`📬 [Contact Service] New message received from: ${name} (${email})`);

  return contact;
}
