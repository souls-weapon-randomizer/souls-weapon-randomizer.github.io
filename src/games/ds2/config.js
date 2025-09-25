import { allBosses, startingClasses } from './bosses.js';

// DS2 doesn't have DLC bosses, so this always returns false
const isDlcBoss = () => false;

// Placeholder weapons data for Dark Souls 2
const placeholderWeapons = [
    {
        name: "Longsword",
        image: "/weapons/longsword.png",
        required_bosses: [],
        required_bosses_with_farm: [],
        black_knight_weapon: false,
        locations: ["Starting weapon", "Merchant purchase"]
    },
    {
        name: "Greatsword",
        image: "/weapons/greatsword.png", 
        required_bosses: ["The Last Giant"],
        required_bosses_with_farm: [],
        black_knight_weapon: false,
        locations: ["No-man's Wharf", "Merchant purchase"]
    }
];

export const DS2_CONFIG = {
    id: 'ds2',
    name: 'Dark Souls 2',
    shortName: 'DS2',
    description: 'Randomize your weapon after defeating each boss in Dark Souls 2',
    icon: '⚔️',
    color: '#8B4513', // Brown theme
    
    // Game data
    weapons: placeholderWeapons,
    allBosses: allBosses,
    startingClasses: startingClasses,
    isDlcBoss: isDlcBoss,
    
    // Game-specific settings
    settings: {
        allowBlackKnightWeapons: false, // DS2 doesn't have Black Knight weapons
        useMasterKey: false, // DS2 doesn't have Master Key
        readyToFarm: false
    },
    
    // Default preferences
    defaultPreferences: {
        allowBlackKnightWeapons: false,
        useMasterKey: false,
        readyToFarm: false
    },
    
    // Storage keys
    storageKeys: {
        PREFERENCES: 'ds2_preferences',
        DEFEATED_BOSSES: 'ds2_defeated_bosses',
        BLACKLIST: 'ds2_blacklist',
        RANDOMIZED_WEAPON: 'ds2_randomized_weapon',
        CURRENT_PAGE: 'ds2_current_page'
    },
    
    // Game-specific features
    features: {
        masterKey: false,
        blackKnightWeapons: false,
        farming: true
    }
};
