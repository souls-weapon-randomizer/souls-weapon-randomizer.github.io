import { allWeapons } from './weapons.js';
import { allBosses, startingClasses } from './bosses.js';
import Preferences from './Preferences.jsx';
import { filterWeapons } from './filterWeapons.js';

// DS2 doesn't have DLC bosses, so this always returns false
const isDlcBoss = () => false;


export const DS2_CONFIG = {
    id: 'ds2',
    name: 'Dark Souls 2',
    shortName: 'DS2',
    description: 'Randomize your weapon after defeating each boss in Dark Souls 2',
    icon: '⚔️',
    color: '#8B4513', // Brown theme
    
    // Game data
    weapons: allWeapons,
    allBosses: allBosses,
    startingClasses: startingClasses,
    isDlcBoss: isDlcBoss,
    
    // Game-specific settings
    settings: {
        allowCrowsOnly: true, // DS2 has crows-only weapons
        allowBonfireAscetic: true, // DS2 has bonfire ascetic required weapons
        readyToFarm: false
    },
    
    // Default preferences
    defaultPreferences: {
        startingClass: 'Warrior', // DS2 starting class
        allowCrowsOnly: true,
        allowBonfireAscetic: true,
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true
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
        farming: true,
        crowsOnly: true,
        bonfireAscetic: true,
        startingGift: false // DS2 doesn't have starting gifts
    },
    
    // Game-specific components and functions
    Preferences,
    filterWeapons
};
