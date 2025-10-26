import { Resend } from 'resend';

let connectionSettings;

async function getCredentials() {
  // For local development: Check if RESEND_API_KEY is set in .env
  if (process.env.RESEND_API_KEY) {
    return {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    };
  }

  // For Replit: Use connector system
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('Resend not configured. Set RESEND_API_KEY in .env for local development or configure Resend connector in Replit.');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: credentials.fromEmail
  };
}

export class EmailService {
  async sendWelcomeEmail(recipientEmail) {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: '🎉 Welcome to CryptoDrops - Your Airdrop Journey Starts Now!',
      html: this.getWelcomeEmailTemplate(recipientEmail)
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }

    console.log(`✅ Welcome email sent to ${recipientEmail}`);
    return data;
  }

  async sendNewAirdropNotification(airdrop) {
    const NewsletterService = (await import('./newsletter.service.js')).NewsletterService;
    const newsletterService = new NewsletterService();
    const subscribers = await newsletterService.getActiveSubscribers();

    if (subscribers.length === 0) {
      console.log('No active subscribers to notify');
      return { sent: 0, failed: 0 };
    }

    const { client, fromEmail } = await getUncachableResendClient();
    
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        const { data, error } = await client.emails.send({
          from: fromEmail,
          to: subscriber.email,
          subject: `🚀 New Airdrop Alert: ${airdrop.name} on ${airdrop.blockchain}`,
          html: this.getNewAirdropEmailTemplate(airdrop, subscriber.email)
        });

        if (error) {
          console.error(`Error sending email to ${subscriber.email}:`, error);
          return { success: false, email: subscriber.email, error };
        }
        
        console.log(`✅ Airdrop notification sent to ${subscriber.email}`);
        return { success: true, email: subscriber.email, data };
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        return { success: false, email: subscriber.email, error };
      }
    });

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;
    
    console.log(`📧 Sent airdrop notifications: ${successful} succeeded, ${failed} failed out of ${subscribers.length} subscribers`);
    return { sent: successful, failed, total: subscribers.length };
  }

  getWelcomeEmailTemplate(email) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to CryptoDrops</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #6366f1;
            font-size: 22px;
            margin-top: 0;
          }
          .content p {
            font-size: 16px;
            margin: 16px 0;
          }
          .benefits {
            background: #f1f5f9;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
          }
          .benefits ul {
            margin: 0;
            padding-left: 20px;
          }
          .benefits li {
            margin: 8px 0;
            font-size: 15px;
          }
          .cta {
            text-align: center;
            margin: 30px 0;
          }
          .cta a {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            color: white;
            padding: 14px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
          }
          .footer {
            background: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
          }
          .footer a {
            color: #6366f1;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to CryptoDrops!</h1>
          </div>
          <div class="content">
            <h2>Thank you for subscribing! 🚀</h2>
            <p>Hi there,</p>
            <p>Welcome to the CryptoDrops community! You've just taken the first step toward discovering amazing cryptocurrency airdrops and earning free tokens.</p>
            
            <div class="benefits">
              <strong>Here's what you'll get:</strong>
              <ul>
                <li>🔔 <strong>Instant alerts</strong> when new airdrops are posted</li>
                <li>💎 <strong>Verified opportunities</strong> from trusted blockchain projects</li>
                <li>📊 <strong>Exclusive insights</strong> on the best airdrops</li>
                <li>⚡ <strong>Early access</strong> to trending opportunities</li>
              </ul>
            </div>

            <p>We've already helped over <strong>50 million participants</strong> claim more than <strong>$12.5 billion</strong> in airdrops!</p>

            <div class="cta">
              <a href="${process.env.REPLIT_DEV_DOMAIN ? 'https://' + process.env.REPLIT_DEV_DOMAIN : 'http://localhost:5000'}" target="_blank">Explore Airdrops Now</a>
            </div>

            <p>Stay tuned for our next airdrop alert!</p>
            <p>Happy hunting! 🎯</p>
            <p><strong>The CryptoDrops Team</strong></p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you subscribed to CryptoDrops newsletter.</p>
            <p>If you no longer wish to receive these emails, you can <a href="#">unsubscribe here</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getNewAirdropEmailTemplate(airdrop, email) {
    const websiteUrl = process.env.REPLIT_DEV_DOMAIN ? 'https://' + process.env.REPLIT_DEV_DOMAIN : 'http://localhost:5000';
    const airdropUrl = `${websiteUrl}#airdrop-${airdrop.id}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Airdrop: ${airdrop.name}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 30px;
          }
          .airdrop-card {
            background: #f8fafc;
            border-radius: 8px;
            padding: 24px;
            margin: 20px 0;
          }
          .airdrop-title {
            color: #6366f1;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 8px 0;
          }
          .blockchain-badge {
            display: inline-block;
            background: #6366f1;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin: 8px 0;
          }
          .status-badge {
            display: inline-block;
            background: #22c55e;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin: 8px 0 8px 8px;
          }
          .description {
            color: #475569;
            margin: 16px 0;
            font-size: 15px;
          }
          .details {
            margin: 16px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .detail-label {
            font-weight: 600;
            color: #64748b;
          }
          .detail-value {
            color: #1e293b;
          }
          .cta {
            text-align: center;
            margin: 30px 0;
          }
          .cta a {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            color: white;
            padding: 14px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
          }
          .footer {
            background: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
          }
          .footer a {
            color: #6366f1;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 New Airdrop Alert!</h1>
          </div>
          <div class="content">
            <p>Hey there!</p>
            <p>Great news! A new airdrop opportunity has just been posted on CryptoDrops:</p>
            
            <div class="airdrop-card">
              <h2 class="airdrop-title">${airdrop.name}</h2>
              <div>
                <span class="blockchain-badge">${airdrop.blockchain}</span>
                <span class="status-badge">${airdrop.status.toUpperCase()}</span>
              </div>
              
              <p class="description">${airdrop.description}</p>
              
              <div class="details">
                ${airdrop.estimatedReward ? `
                <div class="detail-row">
                  <span class="detail-label">💰 Estimated Reward:</span>
                  <span class="detail-value">${airdrop.estimatedReward}</span>
                </div>
                ` : ''}
                ${airdrop.totalValue ? `
                <div class="detail-row">
                  <span class="detail-label">💎 Total Value:</span>
                  <span class="detail-value">${airdrop.totalValue}</span>
                </div>
                ` : ''}
                ${airdrop.difficulty ? `
                <div class="detail-row">
                  <span class="detail-label">📊 Difficulty:</span>
                  <span class="detail-value">${airdrop.difficulty}</span>
                </div>
                ` : ''}
                ${airdrop.endDate ? `
                <div class="detail-row">
                  <span class="detail-label">⏰ End Date:</span>
                  <span class="detail-value">${airdrop.endDate}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <div class="cta">
              <a href="${airdropUrl}" target="_blank">View Full Details & Participate</a>
            </div>

            <p><strong>Don't miss out on this opportunity!</strong> Click the button above to learn more and start participating.</p>
            
            <p>Good luck! 🍀</p>
            <p><strong>The CryptoDrops Team</strong></p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you subscribed to CryptoDrops airdrop alerts.</p>
            <p>If you no longer wish to receive these emails, you can <a href="#">unsubscribe here</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
