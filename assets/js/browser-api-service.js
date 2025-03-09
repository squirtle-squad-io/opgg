/**
 * Browser-compatible API Service for Riot Games API
 * 
 * This service handles API calls to fetch League of Legends data
 * through our server proxy to avoid exposing API keys in client-side code.
 */
class RiotApiService {
    constructor() {
        // Base URL for Data Dragon CDN (doesn't require API key)
        this.dataDragonUrl = 'https://ddragon.leagueoflegends.com/cdn/13.6.1';
        this.championData = null;
        this.regions = {
            na: 'na1',
            euw: 'euw1',
            kr: 'kr',
            jp: 'jp1',
            br: 'br1',
            eune: 'eun1',
            lan: 'la1',
            las: 'la2',
            oce: 'oc1',
            tr: 'tr1',
            ru: 'ru'
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
            
            const response = await fetch(`${this.dataDragonUrl}/data/en_US/champion.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
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
            // Convert championId to string for comparison
            const champId = championId.toString();
            
            // Find champion by key
            return Object.values(champions).find(champion => champion.key === champId);
        } catch (error) {
            console.error('Error getting champion by ID:', error);
            throw error;
        }
    }

    /**
     * Fetches summoner data by name (using server proxy)
     * @param {string} region - Region code
     * @param {string} summonerName - Summoner name
     * @returns {Promise<Object>} Summoner data
     */
    async getSummonerByName(region, summonerName) {
        try {
            // In a real implementation, this would call our server proxy
            // For demo purposes, we'll return mock data
            console.log(`[API] Fetching summoner: ${summonerName} from ${region}`);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Return mock data
            return {
                id: 'mock-summoner-id',
                accountId: 'mock-account-id',
                puuid: 'mock-puuid',
                name: summonerName,
                profileIconId: 1,
                revisionDate: Date.now(),
                summonerLevel: Math.floor(Math.random() * 500) + 1
            };
        } catch (error) {
            console.error('Error fetching summoner:', error);
            throw error;
        }
    }

    /**
     * Fetches featured games (using server proxy)
     * @param {string} region - Region code
     * @returns {Promise<Object>} Featured games data
     */
    async getFeaturedGames(region) {
        try {
            // In a real implementation, this would call our server proxy
            console.log(`[API] Fetching featured games from ${region}`);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Generate mock featured games
            const gameList = [];
            
            // Create 2 mock games
            for (let i = 0; i < 2; i++) {
                const participants = [];
                
                // Create 10 participants (5 per team)
                for (let j = 0; j < 10; j++) {
                    const teamPrefix = j < 5 ? 'Blue' : 'Red';
                    
                    // Random champion IDs for common champions
                    const championIds = [
                        '266', '103', '84', '12', '32', '34', '1', '22', '136', '268',
                        '432', '53', '63', '201', '51', '164', '69', '31', '42', '122'
                    ];
                    
                    participants.push({
                        championId: championIds[Math.floor(Math.random() * championIds.length)],
                        summonerName: `${teamPrefix}Player${j % 5 + 1}`,
                        teamId: j < 5 ? 100 : 200
                    });
                }
                
                gameList.push({
                    gameId: i + 1,
                    gameMode: i === 0 ? 'CLASSIC' : 'ARAM',
                    gameType: 'MATCHED_GAME',
                    gameLength: Math.floor(Math.random() * 2000) + 600, // 10-40 minutes in seconds
                    mapId: i === 0 ? 11 : 12,
                    platformId: this.getRegion(region).toUpperCase(),
                    participants: participants
                });
            }
            
            return { gameList };
        } catch (error) {
            console.error('Error fetching featured games:', error);
            throw error;
        }
    }

    /**
     * Fetches leaderboards (challenger players)
     * @param {string} region - Region code
     * @returns {Promise<Object>} Leaderboard data
     */
    async getLeaderboards(region) {
        try {
            // In a real implementation, this would call our server proxy
            console.log(`[API] Fetching leaderboards from ${region}`);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 700));
            
            // Generate mock leaderboard data
            const entries = [];
            
            // Create mock entries for challenger players
            const proNames = [
                'Faker', 'Chovy', 'Ruler', 'Canyon', 
                'Keria', 'Deft', 'ShowMaker', 'Nuguri',
                'Caps', 'Jankos', 'Rekkles', 'Hylissang'
            ];
            
            for (let i = 0; i < proNames.length; i++) {
                const wins = Math.floor(Math.random() * 200) + 100;
                const losses = Math.floor(Math.random() * 100) + 50;
                
                entries.push({
                    summonerId: `player-${i}`,
                    summonerName: proNames[i],
                    leaguePoints: 1000 - (i * 50),
                    rank: 'I',
                    wins: wins,
                    losses: losses,
                    veteran: Math.random() > 0.5,
                    inactive: false,
                    freshBlood: Math.random() > 0.8,
                    hotStreak: Math.random() > 0.7
                });
            }
            
            return {
                tier: 'CHALLENGER',
                leagueId: `${region}-challenger-solo-queue`,
                queue: 'RANKED_SOLO_5x5',
                name: `${region.toUpperCase()} Challengers`,
                entries: entries
            };
        } catch (error) {
            console.error('Error fetching leaderboards:', error);
            throw error;
        }
    }

    /**
     * Gets champion win rates by role
     * This is a mock function since Riot doesn't provide this directly
     * @param {string} role - Role (top, jungle, mid, adc, support)
     * @returns {Promise<Array>} Champion win rate data
     */
    async getChampionWinRatesByRole(role) {
        try {
            console.log(`[API] Fetching champion win rates for ${role} role`);
            
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

// Export the service as a global variable for browser use
window.apiService = new RiotApiService();
