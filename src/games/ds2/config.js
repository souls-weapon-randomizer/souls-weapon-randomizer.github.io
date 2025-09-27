import { allWeapons } from './weapons.js';
import { allBosses, startingClasses } from './bosses.js';
import Preferences from './Preferences.jsx';
import { filterWeapons } from './filterWeapons.js';

// DS2 doesn't have DLC bosses, so this always returns false
const isDlcBoss = () => false;


export const DS2_CONFIG = {
    id: 'ds2',
    name: 'Dark Souls 2 SOTFS',
    shortName: 'DS2',
    description: 'Embark on your randomized journey through Drangleic',
    icon: '⚔️',
    color: '#8B4513', // Brown theme
    backgroundImage: '/ds2_landing.png',
    
    // Game data
    weapons: allWeapons,
    allBosses: allBosses,
    startingClasses: startingClasses,
    isDlcBoss: isDlcBoss,
    
    // Default preferences
    defaultPreferences: {
        startingClass: 'Warrior', // DS2 starting class
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: false,
        allowBonfireAscetic: false
    },
    
    // Storage keys
    storageKeys: {
        PREFERENCES: 'ds2_preferences',
        DEFEATED_BOSSES: 'ds2_defeated_bosses',
        BLACKLIST: 'ds2_blacklist',
        RANDOMIZED_WEAPON: 'ds2_randomized_weapon',
        CURRENT_PAGE: 'ds2_current_page'
    },
    
    // Game-specific components and functions
    Preferences,
    filterWeapons
};
