const API_URL = window.location.origin;

export class ApiService {
  static async getAllAirdrops(page = 1, limit = 500) {
    try {
      const response = await fetch(`${API_URL}/api/airdrops?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch airdrops');
      const result = await response.json();
      
      // Handle paginated response format
      if (result && typeof result === 'object' && Array.isArray(result.airdrops)) {
        return result.airdrops;
      }
      
      // Handle legacy array format
      if (Array.isArray(result)) {
        return result;
      }
      
      console.error('Unexpected API response format:', result);
      return [];
    } catch (error) {
      console.error('Error loading airdrops:', error);
      return [];
    }
  }

  static async getAirdropById(id) {
    try {
      const response = await fetch(`${API_URL}/api/airdrops/${id}`);
      if (!response.ok) throw new Error('Failed to fetch airdrop');
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  static async getStats() {
    try {
      const response = await fetch(`${API_URL}/api/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      return {
        totalAirdrops: 0,
        activeAirdrops: 0,
        totalValueDistributed: '$0',
        totalParticipants: '0',
        successfulClaims: '0%'
      };
    }
  }

  static async loadData() {
    const [airdrops, stats] = await Promise.all([
      this.getAllAirdrops(),
      this.getStats()
    ]);
    
    return { airdrops, stats };
  }

  static async subscribeNewsletter(email) {
    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
}
