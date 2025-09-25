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

            // Check weapon type preferences
            if (weapon.type === 'Bow' || weapon.type === 'Crossbow' || weapon.type === 'Greatbow') {
                if (!preferences.allowRanged) return false;
            }
            
            if (weapon.type === 'Pyromancy Flame') {
                if (!preferences.allowPyromancy) return false;
            }
            
            if (weapon.type === 'Catalyst') {
                if (!preferences.allowCatalysts) return false;
            }
            
            if (weapon.type === 'Talisman') {
                if (!preferences.allowTalismans) return false;
            }
            
            if (weapon.type === 'Consumable') {
                if (!preferences.allowConsumables) return false;
            }

            // Special case: Black Firebomb is available when selected as starting gift
            if (weapon.name === 'Black Firebomb' && preferences.startingGift === 'Black Firebomb') {
                return true;
            }
            
            // Special case: Starting weapons are always available for the selected starting class
            if (weapon.starting_classes && weapon.starting_classes.includes(preferences.startingClass)) {
                return true;
            }
            
            // Check boss requirements
            if (!weapon.required_bosses || weapon.required_bosses.length === 0) return true;
            
            // Find a valid requirement that matches current preferences
            const validRequirement = weapon.required_bosses.find(req => {
                // Check Black Knight weapons if not allowed
                if (req.black_knight_weapon && !preferences.allowBlackKnightWeapons) return false;
                
                // Check not guaranteed weapons if not allowed
                if (req.not_guaranteed && !preferences.allowNotGuaranteed) return false;
                
                // Check farmable preference: if weapon requires farming, user must have it enabled
                // If weapon doesn't require farming, it's always available
                if (req.farmable_only && !preferences.readyToFarm) return false;
                
                // Check master key requirement: if weapon requires master key, user must have it enabled
                // If weapon doesn't require master key, it's always available
                if (req.require_master_key && preferences.startingGift !== 'Master Key') return false;
                
                // Check if all required bosses are defeated
                if (!req.bosses || req.bosses.length === 0) return true;
                return req.bosses.every(boss => defeatedBosses.includes(boss));
            });
            
            return !!validRequirement;
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
