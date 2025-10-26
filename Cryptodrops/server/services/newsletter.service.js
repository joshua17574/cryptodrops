/**
 * Newsletter Service
 * Handles business logic for newsletter subscriptions
 * 
 * @module services/newsletter.service
 */

import { db } from '../db.js';
import { newsletterSubscribers } from '../schema.js';
import { eq } from 'drizzle-orm';
import { ValidationError } from '../utils/errors.js';
import { EmailService } from './email.service.js';

export class NewsletterService {
  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Subscribe an email to the newsletter
   * @param {string} email - Subscriber's email address
   * @returns {Promise<Object>} Subscription confirmation
   * @throws {ValidationError} If email already subscribed
   */
  async subscribe(email) {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].active) {
        throw new ValidationError('This email is already subscribed to our newsletter');
      } else {
        await db
          .update(newsletterSubscribers)
          .set({ active: true, subscribedAt: new Date() })
          .where(eq(newsletterSubscribers.email, normalizedEmail));

        let emailSent = true;
        try {
          await this.emailService.sendWelcomeEmail(normalizedEmail);
        } catch (error) {
          emailSent = false;
          console.error(`Warning: Failed to send welcome email to ${normalizedEmail}:`, error.message);
        }

        return {
          message: emailSent
            ? 'Welcome back! Your subscription has been reactivated. Check your email for confirmation.'
            : 'Welcome back! Your subscription has been reactivated. Welcome email could not be sent, but you will receive future airdrop alerts.',
          email: normalizedEmail,
          emailSent
        };
      }
    }

    await db
      .insert(newsletterSubscribers)
      .values({
        email: normalizedEmail,
        active: true
      });

    let emailSent = true;
    try {
      await this.emailService.sendWelcomeEmail(normalizedEmail);
    } catch (error) {
      emailSent = false;
      console.error(`Warning: Failed to send welcome email to ${normalizedEmail}:`, error.message);
    }

    return {
      message: emailSent 
        ? 'Successfully subscribed to newsletter! Check your email for confirmation.'
        : 'Successfully subscribed to newsletter! Welcome email could not be sent, but you will receive future airdrop alerts.',
      email: normalizedEmail,
      emailSent
    };
  }

  /**
   * Unsubscribe an email from the newsletter
   * @param {string} email - Subscriber's email address
   * @returns {Promise<Object>} Unsubscribe confirmation
   */
  async unsubscribe(email) {
    const normalizedEmail = email.toLowerCase().trim();

    await db
      .update(newsletterSubscribers)
      .set({ active: false })
      .where(eq(newsletterSubscribers.email, normalizedEmail));

    return {
      message: 'Successfully unsubscribed from newsletter',
      email: normalizedEmail
    };
  }

  /**
   * Get all active newsletter subscribers
   * @returns {Promise<Array>} Array of active subscribers
   */
  async getActiveSubscribers() {
    return await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.active, true));
  }
}
