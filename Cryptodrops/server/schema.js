import { pgTable, serial, text, varchar, integer, boolean, timestamp, json } from 'drizzle-orm/pg-core';

export const airdrops = pgTable('airdrops', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  blockchain: varchar('blockchain', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  verified: boolean('verified').default(false),
  logo: text('logo'),
  airdropLink: varchar('airdrop_link', { length: 500 }),
  website: varchar('website', { length: 500 }),
  twitter: varchar('twitter', { length: 500 }),
  discord: varchar('discord', { length: 500 }),
  telegram: varchar('telegram', { length: 500 }),
  totalValue: varchar('total_value', { length: 100 }),
  estimatedReward: varchar('estimated_reward', { length: 100 }),
  participants: integer('participants').default(0),
  difficulty: varchar('difficulty', { length: 50 }),
  startDate: varchar('start_date', { length: 50 }),
  endDate: varchar('end_date', { length: 50 }),
  requirements: json('requirements'),
  category: varchar('category', { length: 100 }),
  featured: boolean('featured').default(false),
  ended: boolean('ended').default(false),
  potential: boolean('potential').default(false),
  confirmed: boolean('confirmed').default(false),
  isLatest: boolean('is_latest').default(false),
  isFree: boolean('is_free').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('admin'),
  createdAt: timestamp('created_at').defaultNow()
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
  active: boolean('active').default(true)
});
