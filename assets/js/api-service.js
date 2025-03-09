// Import configuration
const config = require('../../config.js');

/**
 * API Service for Riot Games API
 * 
 * This service handles all API calls to the Riot Games API endpoints
 * and provides methods to fetch champions, summoner data, matches, etc.
 */
class RiotApiService {
    constructor() {
        this.apiKey = config.apiKey;
        this.endpoints = config.endpoints;
        this.regions = config.regions;
        this.championData = null;
    }

    /**
     * Sets the request headers with API key
     * @returns {Object} Headers object with API key
     */
    getHeaders() {
        return {
            'X-Riot-Token': this.apiKey
        };
    }

    /**
     * Converts region code to API region format
     * @param {string} region - Region code (e.g., 'na', 'euw')
     * @returns {string} API region format (e.g., 'na1', 'euw1')
     */
    getRegion(region) {
        return this.regions[region.toLowerCase()] || 'na1';
    }

    /**
     * Fetches all champion data from Data Dragon
     * @returns {Promise<Object>} Champion data
     */
    async getChampions() {
        try {
            if (this.championData) {
                return this.championData;
            }
            
            const response = await fetch(this.endpoints.champions);
            const data = await response.json();
            this.championData = data.data;
            return this.championData;
        } catch (error) {
            console.error('Error fetching champions:', error);
            throw error;
        }
    }

    /**
     * Gets champion data by ID
     * @param {string} championId - Champion ID
     * @returns {Promise<Object>} Champion data
     */
    async getChampionById(championId) {
        try {
            const champions = await this.getChampions();
            return Object.values(champions).find(champion => champion.key === championId.toString());
        } catch (error) {
            console.error('Error getting champion by ID:', error);
            throw error;
        }
    }

    /**
     * Fetches summoner data by name
     * @param {string} region - Region code
     * @param {string} summonerName - Summoner name
     * @returns {Promise<Object>} Summoner data
     */
    async getSummonerByName(region, summonerName) {
        try {
            const apiRegion = this.getRegion(region);
            const url = this.endpoints.summonerByName(apiRegion, summonerName);
            
            const response = await fetch(url, { headers: this.getHeaders() });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching summoner:', error);
            throw error;
        }
    }

    /**
     * Fetches league entries for a summoner
     * @param {string} region - Region code
     * @param {string} summonerId - Summoner ID
     * @returns {Promise<Array>} League entries
     */
    async getLeagueEntries(region, summonerId) {
        try {
            const apiRegion = this.getRegion(region);
            const url = this.endpoints.leagueEntries(apiRegion, summonerId);
            
            const response = await fetch(url, { headers: this.getHeaders() });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching league entries:', error);
            throw error;
        }
    }

    /**
     * Fetches match list for a player
     * @param {string} region - Region code
     * @param {string} puuid - Player UUID
     * @param {number} count - Number of matches to fetch
     * @returns {Promise<Array>} Match IDs
     */
    async getMatchList(region, puuid, count = 5) {
        try {
            const apiRegion = this.getRegion(region);
            const url = this.endpoints.matchList(apiRegion, puuid, count);
            
            const response = await fetch(url, { headers: this.getHeaders() });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching match list:', error);
            throw error;
        }
    }

    /**
     * Fetches match details
     * @param {string} region - Region code
     * @param {string} matchId - Match ID
     * @returns {Promise<Object>} Match details
     */
    async getMatchDetails(region, matchId) {
        try {
            const apiRegion = this.getRegion(region);
            const url = this.endpoints.matchDetails(apiRegion, matchId);
            
            const response = await fetch(url, { headers: this.getHeaders() });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching match details:', error);
            throw error;
        }
    }

    /**
     * Fetches champion mastery for a summoner
     * @param {string} region - Region code
     * @param {string} summonerId - Summoner ID
     * @returns {Promise<Array>} Champion mastery data
     */
    async getChampionMastery(region, summonerId) {
        try {
            const apiRegion = this.getRegion(region);
            const url = this.endpoints.championMastery(apiRegion, summonerId);
            
            const response = await fetch(url, { headers: this.getHeaders() });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching champion mastery:', error);
            throw error;
        }
    }

    /**
     * Fetches featured games
     * @param {string} region - Region code
     * @returns {Promise<Object>} Featured games data
     */
    async getFeaturedGames(region) {
        try {
            const apiRegion = this.getRegion(region);
            const url = this.endpoints.featuredGames(apiRegion);
            
            const response = await fetch(url, { headers: this.getHeaders() });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching featured games:', error);
            throw error;
        }
    }

    /**
     * Fetches leaderboards (challenger players)
     * @param {string} region - Region code
     * @param {string} queue - Queue type
     * @returns {Promise<Object>} Leaderboard data
     */
    async getLeaderboards(region, queue = 'RANKED_SOLO_5x5') {
        try {
            const apiRegion = this.getRegion(region);
            const url = this.endpoints.leaderboards(apiRegion, queue);
            
            const response = await fetch(url, { headers: this.getHeaders() });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching leaderboards:', error);
            throw error;
        }
    }

    /**
     * Gets champion win rates by role
     * This is a mock function since Riot doesn't provide this directly
     * In a real app, you would calculate this from match data
     * @param {string} role - Role (top, jungle, mid, adc, support)
     * @returns {Promise<Array>} Champion win rate data
     */
    async getChampionWinRatesByRole(role) {
        // This would normally be calculated from match data
        // For now, we'll return mock data with real champion names
        try {
            const champions = await this.getChampions();
            const champList = Object.values(champions);
            
            // Filter champions by role (using tags as a rough approximation)
            let roleChampions;
            switch(role) {
                case 'top':
                    roleChampions = champList.filter(c => c.tags.includes('Fighter') || c.tags.includes('Tank'));
                    break;
                case 'jungle':
                    roleChampions = champList.filter(c => c.tags.includes('Fighter') || c.tags.includes('Assassin'));
                    break;
                case 'mid':
                    roleChampions = champList.filter(c => c.tags.includes('Mage') || c.tags.includes('Assassin'));
                    break;
                case 'adc':
                    roleChampions = champList.filter(c => c.tags.includes('Marksman'));
                    break;
                case 'support':
                    roleChampions = champList.filter(c => c.tags.includes('Support') || c.tags.includes('Tank'));
                    break;
                default:
                    roleChampions = champList;
            }
            
            // Take first 8 champions
            const selectedChampions = roleChampions.slice(0, 8);
            
            // Generate random win rates and pick rates
            return selectedChampions.map(champion => ({
                id: champion.id,
                name: champion.name,
                winRate: (48 + Math.random() * 7).toFixed(1) + '%',
                pickRate: (5 + Math.random() * 5).toFixed(1) + '%',
                tier: ['S', 'A', 'B'][Math.floor(Math.random() * 3)]
            }));
        } catch (error) {
            console.error('Error getting champion win rates:', error);
            throw error;
        }
    }
}

// Export the service
module.exports = new RiotApiService();
