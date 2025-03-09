// Riot API Configuration
const config = {
  // Replace with your Riot API key
  apiKey: 'RGAPI-63024c09-0f16-4e3c-a674-53fcf2fba82e',

  // API endpoints
  endpoints: {
    champions: 'https://ddragon.leagueoflegends.com/cdn/13.6.1/data/en_US/champion.json',
    summonerByName: (region, summonerName) => `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`,
    leagueEntries: (region, summonerId) => `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
    matchList: (region, puuid, count = 5) => `https://${getRegionalRoute(region)}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`,
    matchDetails: (region, matchId) => `https://${getRegionalRoute(region)}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
    championMastery: (region, summonerId) => `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`,
    featuredGames: (region) => `https://${region}.api.riotgames.com/lol/spectator/v4/featured-games`,
    leaderboards: (region, queue = 'RANKED_SOLO_5x5') => `https://${region}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/${queue}`
  },

  // Region mapping
  regions: {
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
  }
};

// Helper function to get regional route for match API v5
function getRegionalRoute(region) {
  const regionalRoutes = {
    na1: 'americas',
    br1: 'americas',
    la1: 'americas',
    la2: 'americas',
    euw1: 'europe',
    eun1: 'europe',
    tr1: 'europe',
    ru: 'europe',
    kr: 'asia',
    jp1: 'asia',
    oc1: 'sea'
  };

  return regionalRoutes[region] || 'americas';
}

module.exports = config;
