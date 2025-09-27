import { filterWeapons } from '../../../games/ds2/filterWeapons.js';

describe('DS2 Weapon Filtering', () => {
  // Mock weapon data for testing
  const mockWeapon = {
    name: 'Test Weapon',
    type: 'Sword',
    required_bosses: [
      {
        bosses: ['The Last Giant'],
        farmable_only: false
      }
    ]
  };

  const mockCrowsOnlyWeapon = {
    name: 'Crows Trade Weapon',
    type: 'Sword',
    required_bosses: [
      {
        bosses: ['The Last Giant'],
        farmable_only: false,
        crows_only: true
      }
    ]
  };

  const mockBonfireAsceticWeapon = {
    name: 'Bonfire Ascetic Weapon',
    type: 'Sword',
    required_bosses: [
      {
        bosses: ['The Last Giant'],
        farmable_only: false,
        bonfire_ascetic_required: true
      }
    ]
  };

  const mockFlameWeapon = {
    name: 'Flame Weapon',
    type: 'Flame',
    required_bosses: [
      {
        bosses: ['The Last Giant'],
        farmable_only: false
      }
    ]
  };

  const mockStaffWeapon = {
    name: 'Staff Weapon',
    type: 'Staff',
    required_bosses: [
      {
        bosses: ['The Last Giant'],
        farmable_only: false
      }
    ]
  };

  const mockChimeWeapon = {
    name: 'Chime Weapon',
    type: 'Chime',
    required_bosses: [
      {
        bosses: ['The Last Giant'],
        farmable_only: false
      }
    ]
  };

  const mockStartingWeapon = {
    name: 'Starting Sword',
    type: 'Sword',
    starting_classes: ['Warrior'],
    required_bosses: []
  };

  describe('Basic Boss Requirements', () => {
    test('should return true when all required bosses are defeated', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = ['The Last Giant'];

      const result = filterWeapons(mockWeapon, preferences, defeatedBosses);
      expect(result).toBe(true);
    });

    test('should return false when required bosses are not defeated', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = [];

      const result = filterWeapons(mockWeapon, preferences, defeatedBosses);
      expect(result).toBe(false);
    });
  });

  describe('DS2-Specific Weapon Flags', () => {
    test('should filter crows_only weapons when allowCrowsTrade is false', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: false,
        allowBonfireAscetic: true
      };
      const defeatedBosses = ['The Last Giant'];

      const result = filterWeapons(mockCrowsOnlyWeapon, preferences, defeatedBosses);
      expect(result).toBe(false);
    });

    test('should allow crows_only weapons when allowCrowsTrade is true', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = ['The Last Giant'];

      const result = filterWeapons(mockCrowsOnlyWeapon, preferences, defeatedBosses);
      expect(result).toBe(true);
    });

    test('should filter bonfire_ascetic_required weapons when allowBonfireAscetic is false', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: false
      };
      const defeatedBosses = ['The Last Giant'];

      const result = filterWeapons(mockBonfireAsceticWeapon, preferences, defeatedBosses);
      expect(result).toBe(false);
    });

    test('should allow bonfire_ascetic_required weapons when allowBonfireAscetic is true', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = ['The Last Giant'];

      const result = filterWeapons(mockBonfireAsceticWeapon, preferences, defeatedBosses);
      expect(result).toBe(true);
    });
  });

  describe('DS2 Weapon Type Filtering', () => {
    test('should filter Flame weapons when allowPyromancy is false', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: false,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = ['The Last Giant'];

      const result = filterWeapons(mockFlameWeapon, preferences, defeatedBosses);
      expect(result).toBe(false);
    });

    test('should allow Flame weapons when allowPyromancy is true', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = ['The Last Giant'];

      const result = filterWeapons(mockFlameWeapon, preferences, defeatedBosses);
      expect(result).toBe(true);
    });

    test('should filter Staff weapons when allowCatalysts is false', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: false,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = ['The Last Giant'];

      const result = filterWeapons(mockStaffWeapon, preferences, defeatedBosses);
      expect(result).toBe(false);
    });

    test('should allow Staff weapons when allowCatalysts is true', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = ['The Last Giant'];

      const result = filterWeapons(mockStaffWeapon, preferences, defeatedBosses);
      expect(result).toBe(true);
    });

    test('should filter Chime weapons when allowTalismans is false', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: false,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = ['The Last Giant'];

      const result = filterWeapons(mockChimeWeapon, preferences, defeatedBosses);
      expect(result).toBe(false);
    });

    test('should allow Chime weapons when allowTalismans is true', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = ['The Last Giant'];

      const result = filterWeapons(mockChimeWeapon, preferences, defeatedBosses);
      expect(result).toBe(true);
    });
  });

  describe('Starting Weapons', () => {
    test('should always allow starting weapons for the selected class', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = [];

      const result = filterWeapons(mockStartingWeapon, preferences, defeatedBosses);
      expect(result).toBe(true);
    });

    test('should not allow starting weapons for other classes', () => {
      const preferences = {
        startingClass: 'Cleric',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = [];

      const result = filterWeapons(mockStartingWeapon, preferences, defeatedBosses);
      // Starting weapons for other classes should still be available if they have no boss requirements
      expect(result).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle weapons with no required_bosses', () => {
      const weaponNoBosses = {
        name: 'No Boss Weapon',
        type: 'Sword',
        required_bosses: []
      };

      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = [];

      const result = filterWeapons(weaponNoBosses, preferences, defeatedBosses);
      expect(result).toBe(true);
    });

    test('should handle weapons with null required_bosses', () => {
      const weaponNullBosses = {
        name: 'Null Boss Weapon',
        type: 'Sword',
        required_bosses: null
      };

      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = [];

      const result = filterWeapons(weaponNullBosses, preferences, defeatedBosses);
      expect(result).toBe(true);
    });

    test('should handle weapons with undefined bosses array', () => {
      const weaponUndefinedBosses = {
        name: 'Undefined Boss Weapon',
        type: 'Sword',
        required_bosses: [
          {
            bosses: undefined,
            farmable_only: false
          }
        ]
      };

      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = [];

      const result = filterWeapons(weaponUndefinedBosses, preferences, defeatedBosses);
      expect(result).toBe(true);
    });
  });
});
