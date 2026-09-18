import dotenv from 'dotenv';
dotenv.config();

import { sendContactEmail, verifySmtpConfiguration } from '../src/services/emailService.js';

async function test() {
  console.log('Testing SMTP connection with credentials in server/.env:');
  console.log('User:', process.env.SMTP_USER);
  console.log('Pass length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);

  const verified = await verifySmtpConfiguration();
  console.log('SMTP Verified:', verified);

  if (!verified) {
    console.error('SMTP Verification Failed!');
    process.exit(1);
  }

  console.log('Sending test email from steverogers302006@gmail.com...');
  const result = await sendContactEmail({
    name: 'Steve Rogers',
    email: 'steverogers302006@gmail.com',
    subject: 'Project Inquiry from Portfolio',
    message: 'Hello Akilesh, this is a verified test message sent from steverogers302006@gmail.com through your portfolio contact system.',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  });

  console.log('Email sent successfully! MessageId:', result.messageId);
  process.exit(0);
}

test().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
