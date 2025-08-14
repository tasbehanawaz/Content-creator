import { Resend } from 'resend';

// Initialize Resend client only if API key is available
export const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
