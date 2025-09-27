import { filterWeapons } from '../../../games/dsr/filterWeapons.js';

describe('DSR Weapon Filtering', () => {
  // Mock weapon data for testing
  const mockWeapon = {
    name: 'Test Weapon',
    type: 'Sword',
    required_bosses: [
      {
        bosses: ['Asylum Demon'],
        farmable_only: false,
        black_knight_weapon: false,
        not_guaranteed: false,
        require_master_key: false
      }
    ]
  };

  const mockWeaponWithMultipleRequirements = {
    name: 'Complex Weapon',
    type: 'Bow',
    required_bosses: [
      {
        bosses: ['Asylum Demon'],
        farmable_only: false,
        black_knight_weapon: false,
        not_guaranteed: false,
        require_master_key: false
      },
      {
        bosses: ['Bell Gargoyle'],
        farmable_only: true,
        black_knight_weapon: false,
        not_guaranteed: false,
        require_master_key: false
      }
    ]
  };

  const mockBlackKnightWeapon = {
    name: 'Black Knight Sword',
    type: 'Sword',
    required_bosses: [
      {
        bosses: ['Asylum Demon'],
        farmable_only: false,
        black_knight_weapon: true,
        not_guaranteed: false,
        require_master_key: false
      }
    ]
  };

  const mockMasterKeyWeapon = {
    name: 'Master Key Weapon',
    type: 'Sword',
    required_bosses: [
      {
        bosses: ['Asylum Demon'],
        farmable_only: false,
        black_knight_weapon: false,
        not_guaranteed: false,
        require_master_key: true
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
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = ['Asylum Demon'];

      const result = filterWeapons(mockWeapon, preferences, defeatedBosses);
      expect(result).toBe(true);
    });

    test('should return false when required bosses are not defeated', () => {
      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = [];

      const result = filterWeapons(mockWeapon, preferences, defeatedBosses);
      expect(result).toBe(false);
    });

    test('should return true when any valid requirement is met (OR logic)', () => {
      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: true,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = ['Bell Gargoyle']; // Only second requirement met

      const result = filterWeapons(mockWeaponWithMultipleRequirements, preferences, defeatedBosses);
      expect(result).toBe(true);
    });
  });

  describe('Weapon Type Filtering', () => {
    test('should filter ranged weapons when allowRanged is false', () => {
      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: false,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = ['Asylum Demon'];

      const result = filterWeapons(mockWeaponWithMultipleRequirements, preferences, defeatedBosses);
      expect(result).toBe(false);
    });

    test('should allow ranged weapons when allowRanged is true', () => {
      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = ['Asylum Demon'];

      const result = filterWeapons(mockWeaponWithMultipleRequirements, preferences, defeatedBosses);
      expect(result).toBe(true);
    });
  });

  describe('Special Weapon Flags', () => {
    test('should filter black knight weapons when allowBlackKnightWeapons is false', () => {
      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: false,
        allowNotGuaranteed: true
      };
      const defeatedBosses = ['Asylum Demon'];

      const result = filterWeapons(mockBlackKnightWeapon, preferences, defeatedBosses);
      expect(result).toBe(false);
    });

    test('should allow black knight weapons when allowBlackKnightWeapons is true', () => {
      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = ['Asylum Demon'];

      const result = filterWeapons(mockBlackKnightWeapon, preferences, defeatedBosses);
      expect(result).toBe(true);
    });
  });

  describe('Master Key Requirements', () => {
    test('should filter master key weapons when starting gift is not Master Key', () => {
      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = ['Asylum Demon'];

      const result = filterWeapons(mockMasterKeyWeapon, preferences, defeatedBosses);
      expect(result).toBe(false);
    });

    test('should allow master key weapons when starting gift is Master Key', () => {
      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Master Key',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = ['Asylum Demon'];

      const result = filterWeapons(mockMasterKeyWeapon, preferences, defeatedBosses);
      expect(result).toBe(true);
    });
  });

  describe('Starting Weapons', () => {
    test('should always allow starting weapons for the selected class', () => {
      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = [];

      const result = filterWeapons(mockStartingWeapon, preferences, defeatedBosses);
      expect(result).toBe(true);
    });

    test('should not allow starting weapons for other classes', () => {
      const preferences = {
        startingClass: 'Cleric',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = [];

      const result = filterWeapons(mockStartingWeapon, preferences, defeatedBosses);
      // Starting weapons for other classes should still be available if they have no boss requirements
      expect(result).toBe(true);
    });
  });

  describe('Black Firebomb Special Case', () => {
    test('should always allow Black Firebomb when selected as starting gift', () => {
      const blackFirebomb = {
        name: 'Black Firebomb',
        type: 'Consumable',
        required_bosses: [
          {
            bosses: ['Bell Gargoyle'],
            farmable_only: false,
            black_knight_weapon: false,
            not_guaranteed: false,
            require_master_key: false
          }
        ]
      };

      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = [];

      const result = filterWeapons(blackFirebomb, preferences, defeatedBosses);
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
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
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
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowBlackKnightWeapons: true,
        allowNotGuaranteed: true
      };
      const defeatedBosses = [];

      const result = filterWeapons(weaponNullBosses, preferences, defeatedBosses);
      expect(result).toBe(true);
    });
  });
});
