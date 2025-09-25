import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getGameConfig } from '../games/index.js';

export function useGameData(gameId) {
    const gameConfig = getGameConfig(gameId);
    
    if (!gameConfig) {
        throw new Error(`Game config not found for gameId: ${gameId}`);
    }
    
    // Use game-specific storage keys
    const [preferences, setPreferences] = useLocalStorage(
        gameConfig.storageKeys.PREFERENCES, 
        gameConfig.defaultPreferences
    );
    
    
    const [defeatedBosses, setDefeatedBosses] = useLocalStorage(
        gameConfig.storageKeys.DEFEATED_BOSSES, 
        []
    );
    
    const [blacklist, setBlacklist] = useLocalStorage(
        gameConfig.storageKeys.BLACKLIST, 
        []
    );
    
    const [randomizedWeapon, setRandomizedWeapon] = useLocalStorage(
        gameConfig.storageKeys.RANDOMIZED_WEAPON, 
        null
    );
    
    const [currentPage, setCurrentPage] = useLocalStorage(
        gameConfig.storageKeys.CURRENT_PAGE, 
        'preferences'
    );
    
    // Get active weapons based on game config and preferences
    const [activeWeapons, setActiveWeapons] = useState([]);
    
    useEffect(() => {
        if (!gameConfig.weapons || !preferences) return;
        
        // Start with all weapons, including Black Firebomb if selected as starting gift
        let weaponsToFilter = [...gameConfig.weapons];
        
        // Add Black Firebomb to the pool if it's selected as starting gift
        if (preferences.startingGift === 'Black Firebomb') {
            const blackFirebomb = gameConfig.weapons.find(weapon => weapon.name === 'Black Firebomb');
            if (blackFirebomb && !weaponsToFilter.some(w => w.name === 'Black Firebomb')) {
                weaponsToFilter.push(blackFirebomb);
            }
        }
        
        const filtered = weaponsToFilter.filter(weapon => {
            // Filter blacklisted weapons
            if (blacklist.some(w => w.name === weapon.name)) return false;

            // Use game-specific filter function
            return gameConfig.filterWeapons(weapon, preferences, defeatedBosses);
        });
        
        setActiveWeapons(filtered);
    }, [defeatedBosses, blacklist, preferences, gameConfig]);
    
    return {
        gameConfig,
        preferences,
        setPreferences,
        defeatedBosses,
        setDefeatedBosses,
        blacklist,
        setBlacklist,
        randomizedWeapon,
        setRandomizedWeapon,
        currentPage,
        setCurrentPage,
        activeWeapons
    };
}
