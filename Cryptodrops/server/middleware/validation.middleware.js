import { body, validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';
import { isSecureURL, isSocialMediaLink } from '../utils/validators.js';

/**
 * Middleware to handle validation errors from express-validator
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    throw new ValidationError(errorMessages);
  }
  next();
};

/**
 * Validation rules for user login
 * Sanitizes input to prevent XSS attacks
 */
export const validateLoginRules = [
  body('username')
    .trim()
    .escape()
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must be between 3 and 100 characters')
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for airdrop creation/update
 * Includes XSS sanitization and comprehensive input validation
 */
export const validateAirdropRules = [
  body('name')
    .trim()
    .escape()
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters')
    .notEmpty()
    .withMessage('Name is required'),
  body('description')
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage('Description is required'),
  body('blockchain')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Blockchain is required'),
  body('type')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['social', 'bounty-platforms', 'testnet', 'mainnet', 'fill-form', 'role', 'liquidity', 'mint-nft', 'gaming', 'staking', 'trading', 'node', 'depin', 'mint-domain', 'hold', 'ambassador', 'wallet-airdrop', 'contract-deployment', 'taskbased'])
    .withMessage('Type must be one of: social, bounty-platforms, testnet, mainnet, fill-form, role, liquidity, mint-nft, gaming, staking, trading, node, depin, mint-domain, hold, ambassador, wallet-airdrop, contract-deployment, taskbased'),
  body('status')
    .trim()
    .toLowerCase()
    .isIn(['active', 'upcoming', 'ended'])
    .withMessage('Status must be one of: active, upcoming, ended'),
  body('participants')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Participants must be a non-negative number')
    .toInt(),
  body('estimatedReward')
    .optional()
    .trim()
    .escape(),
  body('totalValue')
    .optional()
    .trim()
    .escape(),
  body('website')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !isSecureURL(value)) {
        throw new Error('Website must be a valid and secure URL');
      }
      return true;
    }),
  body('airdropLink')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !isSecureURL(value)) {
        throw new Error('Airdrop link must be a valid and secure URL');
      }
      return true;
    }),
  body('twitter')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !isSocialMediaLink(value, 'twitter')) {
        throw new Error('Twitter link must be a valid Twitter/X URL');
      }
      return true;
    }),
  body('discord')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !isSocialMediaLink(value, 'discord')) {
        throw new Error('Discord link must be a valid Discord URL');
      }
      return true;
    }),
  body('telegram')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !isSocialMediaLink(value, 'telegram')) {
        throw new Error('Telegram link must be a valid Telegram URL');
      }
      return true;
    })
];

/**
 * Validation rules for newsletter subscription
 * Validates and sanitizes email input
 */
export const validateNewsletterRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required')
];
