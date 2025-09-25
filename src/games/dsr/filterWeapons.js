// DSR-specific weapon filtering logic
export function filterWeapons(weapon, preferences, defeatedBosses) {
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
        return req.bosses.every(boss => defeatedBosses.includes(boss));
    });
    
    return !!validRequirement;
}
