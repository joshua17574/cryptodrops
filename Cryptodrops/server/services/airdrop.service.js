/**
 * Airdrop Service
 * Handles business logic for airdrop operations
 * Interacts with the database using Drizzle ORM
 * 
 * @module services/airdrop.service
 */

import { db } from '../db.js';
import { airdrops } from '../schema.js';
import { eq, desc, count } from 'drizzle-orm';
import { NotFoundError } from '../utils/errors.js';
import { ERROR_MESSAGES } from '../constants/http.constants.js';

export class AirdropService {
  /**
   * Retrieve all airdrops from the database with pagination
   * @param {number} page - Page number (1-indexed)
   * @param {number} limit - Number of items per page
   * @returns {Promise<Object>} Object with airdrops array and pagination metadata
   */
  async getAllAirdrops(page = 1, limit = 100) {
    const offset = (page - 1) * limit;
    
    const [allAirdrops, countResult] = await Promise.all([
      db
        .select()
        .from(airdrops)
        .orderBy(desc(airdrops.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(airdrops)
    ]);

    const total = Number(countResult[0]?.count || 0);
    const totalPages = Math.ceil(total / limit);

    return {
      airdrops: allAirdrops,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    };
  }

  /**
   * Retrieve a single airdrop by its ID
   * @param {number|string} id - Airdrop ID
   * @returns {Promise<Object>} Airdrop object
   * @throws {NotFoundError} If airdrop with given ID doesn't exist
   */
  async getAirdropById(id) {
    const airdrop = await db
      .select()
      .from(airdrops)
      .where(eq(airdrops.id, parseInt(id)))
      .limit(1);

    if (airdrop.length === 0) {
      throw new NotFoundError(ERROR_MESSAGES.AIRDROP_NOT_FOUND);
    }

    return airdrop[0];
  }

  /**
   * Create a new airdrop in the database
   * @param {Object} airdropData - Airdrop data object
   * @param {string} airdropData.name - Name of the airdrop
   * @param {string} airdropData.description - Description
   * @param {string} airdropData.blockchain - Blockchain platform
   * @param {string} airdropData.type - Type of airdrop
   * @param {string} airdropData.status - Status (active/upcoming/ended)
   * @returns {Promise<Object>} Created airdrop object
   */
  async createAirdrop(airdropData) {
    const newAirdrop = await db
      .insert(airdrops)
      .values(airdropData)
      .returning();

    return newAirdrop[0];
  }

  /**
   * Update an existing airdrop
   * @param {number|string} id - Airdrop ID
   * @param {Object} airdropData - Updated airdrop data
   * @returns {Promise<Object>} Updated airdrop object
   * @throws {NotFoundError} If airdrop with given ID doesn't exist
   */
  async updateAirdrop(id, airdropData) {
    const updated = await db
      .update(airdrops)
      .set({ ...airdropData, updatedAt: new Date() })
      .where(eq(airdrops.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      throw new NotFoundError(ERROR_MESSAGES.AIRDROP_NOT_FOUND);
    }

    return updated[0];
  }

  /**
   * Delete an airdrop from the database
   * @param {number|string} id - Airdrop ID
   * @returns {Promise<Object>} Success message
   * @throws {NotFoundError} If airdrop with given ID doesn't exist
   */
  async deleteAirdrop(id) {
    const deleted = await db
      .delete(airdrops)
      .where(eq(airdrops.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      throw new NotFoundError(ERROR_MESSAGES.AIRDROP_NOT_FOUND);
    }

    return { message: 'Airdrop deleted successfully' };
  }

  /**
   * Calculate comprehensive statistics from the database
   * @returns {Promise<Object>} Statistics object with real calculated data
   */
  async getStats() {
    const allAirdrops = await db.select().from(airdrops);
    
    // Calculate active airdrops (active status only)
    const activeAirdrops = allAirdrops.filter(a => a.status === 'active');
    
    // Calculate total participants across all airdrops
    const totalParticipants = allAirdrops.reduce(
      (sum, a) => sum + (a.participants || 0),
      0
    );

    // Calculate total value distributed from airdrops with totalValue field
    let totalValueInUSD = 0;
    allAirdrops.forEach(a => {
      if (a.totalValue) {
        // Extract numeric value from strings like "$1.5M", "$500K", "$2B", etc.
        const cleanValue = a.totalValue.replace(/[$,]/g, '');
        const multiplier = cleanValue.includes('B') ? 1000000000 
                         : cleanValue.includes('M') ? 1000000 
                         : cleanValue.includes('K') ? 1000 
                         : 1;
        const numericValue = parseFloat(cleanValue.replace(/[BMK]/g, '')) || 0;
        totalValueInUSD += numericValue * multiplier;
      }
    });

    // Format total value distributed
    const formatValue = (value) => {
      if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
      return `$${value.toFixed(0)}`;
    };

    // Calculate successful claims percentage
    // Based on ended airdrops vs confirmed airdrops
    const endedAirdrops = allAirdrops.filter(a => a.ended || a.status === 'ended');
    const confirmedAirdrops = allAirdrops.filter(a => a.confirmed);
    const successRate = endedAirdrops.length > 0 
      ? Math.round((confirmedAirdrops.length / endedAirdrops.length) * 100)
      : 0;

    // Format participants count
    const formatParticipants = (count) => {
      if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M+`;
      if (count >= 1000) return `${(count / 1000).toFixed(1)}K+`;
      return count.toString();
    };

    return {
      totalAirdrops: allAirdrops.length,
      activeAirdrops: activeAirdrops.length,
      totalValueDistributed: formatValue(totalValueInUSD),
      totalParticipants: formatParticipants(totalParticipants),
      successfulClaims: `${successRate}%`,
      // Additional stats for better insights
      upcomingAirdrops: allAirdrops.filter(a => a.status === 'upcoming').length,
      verifiedAirdrops: allAirdrops.filter(a => a.verified).length,
      confirmedAirdrops: confirmedAirdrops.length
    };
  }
}
