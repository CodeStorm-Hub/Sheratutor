import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  const host = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com';
  const port = parseInt(process.env.ZOHO_SMTP_PORT || '465', 10);
  const user = process.env.ZOHO_SMTP_USER || 'support@sheratutor.tech';
  const pass = process.env.ZOHO_SMTP_PASS || '';

  if (!pass) {
    console.warn('[EmailTransporter] ZOHO_SMTP_PASS is not set. Outgoing emails may fail.');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL for 465, STARTTLS for 587
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}
