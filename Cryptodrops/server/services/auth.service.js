/**
 * Authentication Service
 * Handles user authentication business logic including login and registration
 * Uses bcrypt for password hashing and JWT for token generation
 * 
 * @module services/auth.service
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { users } from '../schema.js';
import { eq } from 'drizzle-orm';
import { config } from '../config/env.config.js';
import { UnauthorizedError, ValidationError } from '../utils/errors.js';
import { ERROR_MESSAGES } from '../constants/http.constants.js';

export class AuthService {
  /**
   * Authenticate user with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password (plain text)
   * @returns {Promise<Object>} Object containing JWT token and user information
   * @throws {UnauthorizedError} If credentials are invalid
   */
  async login(username, password) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (user.length === 0) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = jwt.sign(
      { id: user[0].id, username: user[0].username, role: user[0].role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      token,
      user: {
        id: user[0].id,
        username: user[0].username,
        role: user[0].role
      }
    };
  }

  /**
   * Register a new admin user
   * Hashes password with bcrypt and creates JWT token
   * @param {string} username - Desired username
   * @param {string} password - User's password (plain text, will be hashed)
   * @returns {Promise<Object>} Object containing JWT token and user information
   * @throws {ValidationError} If username already exists
   */
  async register(username, password) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ValidationError(ERROR_MESSAGES.USERNAME_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);

    const newUser = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        role: 'admin'
      })
      .returning();

    const token = jwt.sign(
      { id: newUser[0].id, username: newUser[0].username, role: newUser[0].role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return {
      token,
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        role: newUser[0].role
      }
    };
  }
}
