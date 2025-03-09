/**
 * OP.GG Clone - Main JavaScript
 * 
 * This file handles the dynamic content rendering for the OP.GG clone,
 * including champions, live games, and pro players.
 */

// Global variables
let currentRegion = 'na';
const dataDragonUrl = 'https://ddragon.leagueoflegends.com/cdn/13.6.1';

// DOM elements
const championsContainer = document.getElementById('champions-container');
const liveGamesContainer = document.getElementById('live-games-container');
const proPlayersContainer = document.getElementById('pro-players-container');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-btn');
const regionSelectHeader = document.querySelector('.user-actions .region-select');
const regionSelectSearch = document.querySelector('.region-select-search');
const roleTabs = document.querySelectorAll('.tabs .tab');

/**
 * Initialize the application
 */
async function init() {
    try {
        // Set up event listeners
        setupEventListeners();
        
        // Load initial data
        await loadChampionsByRole('top');
        await loadLiveGames();
        await loadProPlayers();
    } catch (error) {
        console.error('Error initializing application:', error);
        showError('Failed to initialize application. Please try again later.');
    }
}

/**
 * Set up event listeners for user interactions
 */
function setupEventListeners() {
    // Role tabs for champions
    roleTabs.forEach(tab => {
        tab.addEventListener('click', async () => {
            // Update active tab
            roleTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Load champions for selected role
            const role = tab.dataset.role;
            await loadChampionsByRole(role);
        });
    });
    
    // Region selectors (sync both dropdowns)
    regionSelectHeader.addEventListener('change', (e) => {
        currentRegion = e.target.value;
        regionSelectSearch.value = currentRegion;
        refreshData();
    });
    
    regionSelectSearch.addEventListener('change', (e) => {
        currentRegion = e.target.value;
        regionSelectHeader.value = currentRegion;
        refreshData();
    });
    
    // Search functionality
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

/**
 * Handle summoner search
 */
async function handleSearch() {
    const summonerName = searchInput.value.trim();
    if (!summonerName) {
        showError('Please enter a summoner name');
        return;
    }
    
    try {
        showLoading('Searching for summoner...');
        
        // Get summoner data
        const summoner = await window.apiService.getSummonerByName(currentRegion, summonerName);
        
        // For demo purposes, just show an alert with the summoner info
        alert(`Found summoner: ${summoner.name}\nLevel: ${summoner.summonerLevel}\n\nIn a complete implementation, this would redirect to the summoner profile page.`);
        
        hideLoading();
    } catch (error) {
        console.error('Error searching for summoner:', error);
        showError(`Could not find summoner "${summonerName}" in ${currentRegion.toUpperCase()}`);
    }
}

/**
 * Load champions by role
 * @param {string} role - The role to filter champions by
 */
async function loadChampionsByRole(role) {
    try {
        // Show loading state
        championsContainer.innerHTML = '<div class="loading">Loading champions...</div>';
        
        // Get champion win rates by role
        const champions = await window.apiService.getChampionWinRatesByRole(role);
        
        // Clear loading state
        championsContainer.innerHTML = '';
        
        // Render champions
        champions.forEach(champion => {
            const championElement = createChampionElement(champion);
            championsContainer.appendChild(championElement);
        });
    } catch (error) {
        console.error('Error loading champions:', error);
        championsContainer.innerHTML = '<div class="error">Failed to load champions</div>';
    }
}

/**
 * Create a champion element
 * @param {Object} champion - Champion data
 * @returns {HTMLElement} Champion element
 */
function createChampionElement(champion) {
    const championElement = document.createElement('div');
    championElement.className = 'champion-card';
    
    // Champion image URL from Data Dragon
    const championImageUrl = `${dataDragonUrl}/img/champion/${champion.id}.png`;
    
    championElement.innerHTML = `
        <div class="champion-image">
            <img src="${championImageUrl}" alt="${champion.name}">
            <span class="tier ${champion.tier.toLowerCase()}">${champion.tier}</span>
        </div>
        <div class="champion-info">
            <h3>${champion.name}</h3>
            <div class="champion-stats">
                <div class="stat">
                    <span class="label">Win Rate</span>
                    <span class="value">${champion.winRate}</span>
                </div>
                <div class="stat">
                    <span class="label">Pick Rate</span>
                    <span class="value">${champion.pickRate}</span>
                </div>
            </div>
        </div>
    `;
    
    return championElement;
}

/**
 * Load live games
 */
async function loadLiveGames() {
    try {
        // Show loading state
        liveGamesContainer.innerHTML = '<div class="loading">Loading live games...</div>';
        
        // Get featured games
        const featuredGames = await window.apiService.getFeaturedGames(currentRegion);
        
        // Clear loading state
        liveGamesContainer.innerHTML = '';
        
        // Render live games
        if (featuredGames.gameList && featuredGames.gameList.length > 0) {
            featuredGames.gameList.forEach(game => {
                const gameElement = createLiveGameElement(game);
                liveGamesContainer.appendChild(gameElement);
            });
        } else {
            liveGamesContainer.innerHTML = '<div class="no-data">No live games available</div>';
        }
    } catch (error) {
        console.error('Error loading live games:', error);
        liveGamesContainer.innerHTML = '<div class="error">Failed to load live games</div>';
    }
}

/**
 * Create a live game element
 * @param {Object} game - Game data
 * @returns {HTMLElement} Live game element
 */
function createLiveGameElement(game) {
    const gameElement = document.createElement('div');
    gameElement.className = 'live-game-card';
    
    // Game duration in minutes and seconds
    const minutes = Math.floor(game.gameLength / 60);
    const seconds = game.gameLength % 60;
    
    // Get participants for blue and red teams
    const blueTeam = game.participants.filter(p => p.teamId === 100).slice(0, 5);
    const redTeam = game.participants.filter(p => p.teamId === 200).slice(0, 5);
    
    // Create HTML for the game card
    gameElement.innerHTML = `
        <div class="game-header">
            <div class="game-mode">${game.gameMode}</div>
            <div class="game-time">${minutes}:${seconds.toString().padStart(2, '0')}</div>
        </div>
        <div class="game-teams">
            <div class="team blue-team">
                ${blueTeam.map(participant => createParticipantHTML(participant)).join('')}
            </div>
            <div class="vs">VS</div>
            <div class="team red-team">
                ${redTeam.map(participant => createParticipantHTML(participant)).join('')}
            </div>
        </div>
        <div class="game-footer">
            <button class="spectate-btn">Spectate</button>
        </div>
    `;
    
    // Add event listener for spectate button
    const spectateBtn = gameElement.querySelector('.spectate-btn');
    spectateBtn.addEventListener('click', () => {
        alert(`Spectating game ${game.gameId} is not implemented in this demo.`);
    });
    
    return gameElement;
}

/**
 * Create HTML for a game participant
 * @param {Object} participant - Participant data
 * @returns {string} Participant HTML
 */
async function createParticipantHTML(participant) {
    // Get champion data for the participant
    let championName = 'Unknown';
    let championImageUrl = '';
    
    try {
        const champion = await window.apiService.getChampionById(participant.championId);
        if (champion) {
            championName = champion.name;
            championImageUrl = `${dataDragonUrl}/img/champion/${champion.id}.png`;
        }
    } catch (error) {
        console.error('Error getting champion data:', error);
    }
    
    return `
        <div class="participant">
            <div class="champion-icon">
                <img src="${championImageUrl}" alt="${championName}">
            </div>
            <div class="summoner-name">${participant.summonerName}</div>
        </div>
    `;
}

/**
 * Load pro players
 */
async function loadProPlayers() {
    try {
        // Show loading state
        proPlayersContainer.innerHTML = '<div class="loading">Loading pro players...</div>';
        
        // Get leaderboards
        const leaderboards = await window.apiService.getLeaderboards(currentRegion);
        
        // Clear loading state
        proPlayersContainer.innerHTML = '';
        
        // Render pro players
        if (leaderboards.entries && leaderboards.entries.length > 0) {
            // Sort by league points
            const sortedEntries = leaderboards.entries.sort((a, b) => b.leaguePoints - a.leaguePoints);
            
            // Take top 5 players
            const topPlayers = sortedEntries.slice(0, 5);
            
            topPlayers.forEach((player, index) => {
                const playerElement = createProPlayerElement(player, index + 1);
                proPlayersContainer.appendChild(playerElement);
            });
        } else {
            proPlayersContainer.innerHTML = '<div class="no-data">No pro players available</div>';
        }
    } catch (error) {
        console.error('Error loading pro players:', error);
        proPlayersContainer.innerHTML = '<div class="error">Failed to load pro players</div>';
    }
}

/**
 * Create a pro player element
 * @param {Object} player - Player data
 * @param {number} rank - Player rank
 * @returns {HTMLElement} Pro player element
 */
function createProPlayerElement(player, rank) {
    const playerElement = document.createElement('div');
    playerElement.className = 'pro-player-card';
    
    // Calculate win rate
    const totalGames = player.wins + player.losses;
    const winRate = totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(1) : '0.0';
    
    // Random profile icon
    const profileIconId = Math.floor(Math.random() * 50) + 1;
    const profileIconUrl = `${dataDragonUrl}/img/profileicon/${profileIconId}.png`;
    
    playerElement.innerHTML = `
        <div class="player-rank">#${rank}</div>
        <div class="player-info">
            <div class="player-icon">
                <img src="${profileIconUrl}" alt="Profile Icon">
            </div>
            <div class="player-details">
                <h3 class="player-name">${player.summonerName}</h3>
                <div class="player-stats">
                    <div class="stat">
                        <span class="label">LP</span>
                        <span class="value">${player.leaguePoints}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Win Rate</span>
                        <span class="value">${winRate}%</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return playerElement;
}

/**
 * Refresh all data
 */
async function refreshData() {
    try {
        // Get active role
        const activeTab = document.querySelector('.tabs .tab.active');
        const role = activeTab ? activeTab.dataset.role : 'top';
        
        // Reload all data
        await Promise.all([
            loadChampionsByRole(role),
            loadLiveGames(),
            loadProPlayers()
        ]);
    } catch (error) {
        console.error('Error refreshing data:', error);
        showError('Failed to refresh data. Please try again later.');
    }
}

/**
 * Show loading message
 * @param {string} message - Loading message
 */
function showLoading(message = 'Loading...') {
    // Create loading overlay if it doesn't exist
    let loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        document.body.appendChild(loadingOverlay);
    }
    
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-message">${message}</div>
    `;
    
    loadingOverlay.style.display = 'flex';
}

/**
 * Hide loading message
 */
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    // Create error toast if it doesn't exist
    let errorToast = document.getElementById('error-toast');
    if (!errorToast) {
        errorToast = document.createElement('div');
        errorToast.id = 'error-toast';
        document.body.appendChild(errorToast);
    }
    
    errorToast.textContent = message;
    errorToast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        errorToast.classList.remove('show');
    }, 3000);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
