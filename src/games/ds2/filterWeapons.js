// DS2-specific weapon filtering logic
export function filterWeapons(weapon, preferences, defeatedBosses) {
    // Check weapon type preferences - DS2 specific types
    if (weapon.type === 'Bow' || weapon.type === 'Crossbow' || weapon.type === 'Greatbow') {
        if (!preferences.allowRanged) return false;
    }
    
    if (weapon.type === 'Flame') {
        if (!preferences.allowPyromancy) return false;
    }
    
    if (weapon.type === 'Staff') {
        if (!preferences.allowCatalysts) return false;
    }
    
    if (weapon.type === 'Chime') {
        if (!preferences.allowTalismans) return false;
    }
    
    if (weapon.type === 'Consumable') {
        if (!preferences.allowConsumables) return false;
    }

    // Check DS2-specific weapon flags
    if (weapon.crows_only && !preferences.allowCrowsOnly) return false;
    if (weapon.bonfire_ascetic_required && !preferences.allowBonfireAscetic) return false;
    
    // Special case: Starting weapons are always available for the selected starting class
    if (weapon.starting_classes && weapon.starting_classes.includes(preferences.startingClass)) {
        return true;
    }
    
    // Check boss requirements
    if (!weapon.required_bosses || weapon.required_bosses.length === 0) return true;
    
    // Find a valid requirement that matches current preferences
    const validRequirement = weapon.required_bosses.find(req => {
        // Check farmable preference: if weapon requires farming, user must have it enabled
        // If weapon doesn't require farming, it's always available
        if (req.farmable_only && !preferences.readyToFarm) return false;
        
        // Check if all required bosses are defeated
        if (!req.bosses || req.bosses.length === 0) return true;
        return req.bosses.every(boss => defeatedBosses.includes(boss));
    });
    
    return !!validRequirement;
}
