import { DSR_CONFIG } from './dsr/config.js';
import { DS2_CONFIG } from './ds2/config.js';

// Export all game configurations
export const GAMES = {
    dsr: DSR_CONFIG,
    ds2: DS2_CONFIG
};

// Export individual configs
export { DSR_CONFIG, DS2_CONFIG };

// Helper function to get game config by ID
export const getGameConfig = (gameId) => {
    return GAMES[gameId] || null;
};

// Get all available games
export const getAllGames = () => {
    return Object.values(GAMES);
};

// Get game IDs
export const getGameIds = () => {
    return Object.keys(GAMES);
};
