import { allWeapons } from './weapons.js';
import { allBosses, startingClasses, isDlcBoss } from './bosses.js';

export const DSR_CONFIG = {
    id: 'dsr',
    name: 'Dark Souls Remastered',
    shortName: 'DSR',
    description: 'Embark on your randomized journey through Lordran',
    icon: '🔥',
    color: '#FF8C00', // Orange theme
    
    // Game data
    weapons: allWeapons,
    allBosses: allBosses,
    startingClasses: startingClasses,
    isDlcBoss: isDlcBoss,
    
    // Game-specific settings
    settings: {
        allowBlackKnightWeapons: true,
        useMasterKey: true,
        readyToFarm: false
    },
    
    // Default preferences
    defaultPreferences: {
        startingClass: 'Warrior',
        allowBlackKnightWeapons: false,
        useMasterKey: false,
        readyToFarm: false,
        allowNotGuaranteed: false,
        allowPyromancy: false,
        allowCatalysts: false,
        allowTalismans: false,
        allowRanged: false,
        allowConsumables: false
    },
    
    // Storage keys
    storageKeys: {
        PREFERENCES: 'dsr_preferences',
        DEFEATED_BOSSES: 'dsr_defeated_bosses',
        BLACKLIST: 'dsr_blacklist',
        RANDOMIZED_WEAPON: 'dsr_randomized_weapon',
        CURRENT_PAGE: 'dsr_current_page'
    },
    
    // Game-specific features
    features: {
        masterKey: true,
        blackKnightWeapons: true,
        farming: true
    }
};
