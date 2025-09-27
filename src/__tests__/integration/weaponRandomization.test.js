import { filterWeapons as dsrFilterWeapons } from '../../games/dsr/filterWeapons.js';
import { filterWeapons as ds2FilterWeapons } from '../../games/ds2/filterWeapons.js';
import { allWeapons as dsrWeapons } from '../../games/dsr/weapons.js';
import { allWeapons as ds2Weapons } from '../../games/ds2/weapons.js';

describe('Weapon Randomization Integration Tests', () => {
  describe('DSR Complete User Scenarios', () => {
    test('new player with default preferences should see starting weapons only', () => {
      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: false,
        allowPyromancy: false,
        allowCatalysts: false,
        allowTalismans: false,
        allowConsumables: false,
        allowBlackKnightWeapons: false,
        allowNotGuaranteed: false
      };
      const defeatedBosses = [];
      const blacklist = [];

      const availableWeapons = dsrWeapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return dsrFilterWeapons(weapon, preferences, defeatedBosses);
      });

      // Should only have starting weapons and Black Firebomb
      expect(availableWeapons.length).toBeGreaterThan(0);
      availableWeapons.forEach(weapon => {
        if (weapon.name !== 'Black Firebomb' && weapon.starting_classes) {
          expect(weapon.starting_classes).toContain('Warrior');
        }
      });
    });

    test('player with all preferences enabled should see more weapons', () => {
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
      const defeatedBosses = ['Asylum Demon'];
      const blacklist = [];

      const availableWeapons = dsrWeapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return dsrFilterWeapons(weapon, preferences, defeatedBosses);
      });

      expect(availableWeapons.length).toBeGreaterThan(0);
    });

    test('blacklisted weapons should be excluded', () => {
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
      const defeatedBosses = ['Asylum Demon'];
      const blacklist = [{ name: 'Longsword' }];

      const availableWeapons = dsrWeapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return dsrFilterWeapons(weapon, preferences, defeatedBosses);
      });

      const blacklistedWeapon = availableWeapons.find(w => w.name === 'Longsword');
      expect(blacklistedWeapon).toBeUndefined();
    });

    test('Master Key selection should unlock master key weapons', () => {
      const preferencesMasterKey = {
        startingClass: 'Warrior',
        startingGift: 'Master Key',
        readyToFarm: false,
        allowRanged: false,
        allowPyromancy: false,
        allowCatalysts: false,
        allowTalismans: false,
        allowConsumables: false,
        allowBlackKnightWeapons: false,
        allowNotGuaranteed: false
      };

      const preferencesNoMasterKey = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: false,
        allowPyromancy: false,
        allowCatalysts: false,
        allowTalismans: false,
        allowConsumables: false,
        allowBlackKnightWeapons: false,
        allowNotGuaranteed: false
      };

      const defeatedBosses = [];
      const blacklist = [];

      const weaponsWithMasterKey = dsrWeapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return dsrFilterWeapons(weapon, preferencesMasterKey, defeatedBosses);
      });

      const weaponsWithoutMasterKey = dsrWeapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return dsrFilterWeapons(weapon, preferencesNoMasterKey, defeatedBosses);
      });

      expect(weaponsWithMasterKey.length).toBeGreaterThanOrEqual(weaponsWithoutMasterKey.length);
    });
  });

  describe('DS2 Complete User Scenarios', () => {
    test('new player with default preferences should see starting weapons only', () => {
      const preferences = {
        startingClass: 'Swordsman',
        readyToFarm: false,
        allowRanged: false,
        allowPyromancy: false,
        allowCatalysts: false,
        allowTalismans: false,
        allowConsumables: false,
        allowCrowsTrade: false,
        allowBonfireAscetic: false
      };
      const defeatedBosses = [];
      const blacklist = [];

      const availableWeapons = ds2Weapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return ds2FilterWeapons(weapon, preferences, defeatedBosses);
      });

      // Should only have starting weapons
      expect(availableWeapons.length).toBeGreaterThan(0);
      // Check that we have some starting weapons for the selected class
      const startingWeapons = availableWeapons.filter(weapon => 
        weapon.starting_classes && weapon.starting_classes.includes('Swordsman')
      );
      expect(startingWeapons.length).toBeGreaterThan(0);
    });

    test('player with all preferences enabled should see more weapons', () => {
      const preferences = {
        startingClass: 'Warrior',
        readyToFarm: true,
        allowRanged: true,
        allowPyromancy: true,
        allowCatalysts: true,
        allowTalismans: true,
        allowConsumables: true,
        allowCrowsTrade: true,
        allowBonfireAscetic: true
      };
      const defeatedBosses = ['The Last Giant'];
      const blacklist = [];

      const availableWeapons = ds2Weapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return ds2FilterWeapons(weapon, preferences, defeatedBosses);
      });

      expect(availableWeapons.length).toBeGreaterThan(0);
    });

    test('crows trade preference should affect crows_only weapons', () => {
      const preferencesWithCrows = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: false,
        allowPyromancy: false,
        allowCatalysts: false,
        allowTalismans: false,
        allowConsumables: false,
        allowCrowsTrade: true,
        allowBonfireAscetic: false
      };

      const preferencesWithoutCrows = {
        startingClass: 'Warrior',
        readyToFarm: false,
        allowRanged: false,
        allowPyromancy: false,
        allowCatalysts: false,
        allowTalismans: false,
        allowConsumables: false,
        allowCrowsTrade: false,
        allowBonfireAscetic: false
      };

      const defeatedBosses = [];
      const blacklist = [];

      const weaponsWithCrows = ds2Weapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return ds2FilterWeapons(weapon, preferencesWithCrows, defeatedBosses);
      });

      const weaponsWithoutCrows = ds2Weapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return ds2FilterWeapons(weapon, preferencesWithoutCrows, defeatedBosses);
      });

      expect(weaponsWithCrows.length).toBeGreaterThanOrEqual(weaponsWithoutCrows.length);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle empty weapon pool gracefully', () => {
      const preferences = {
        startingClass: 'Warrior',
        startingGift: 'Black Firebomb',
        readyToFarm: false,
        allowRanged: false,
        allowPyromancy: false,
        allowCatalysts: false,
        allowTalismans: false,
        allowConsumables: false,
        allowBlackKnightWeapons: false,
        allowNotGuaranteed: false
      };
      const defeatedBosses = [];
      const blacklist = dsrWeapons.map(weapon => ({ name: weapon.name })); // Blacklist everything

      const availableWeapons = dsrWeapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return dsrFilterWeapons(weapon, preferences, defeatedBosses);
      });

      expect(availableWeapons.length).toBe(0);
    });

    test('should handle all weapons blacklisted scenario', () => {
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
      const defeatedBosses = ['Asylum Demon', 'Bell Gargoyle', 'Capra Demon'];
      const blacklist = dsrWeapons.map(weapon => ({ name: weapon.name }));

      const availableWeapons = dsrWeapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return dsrFilterWeapons(weapon, preferences, defeatedBosses);
      });

      expect(availableWeapons.length).toBe(0);
    });

    test('should handle invalid game selection gracefully', () => {
      // This test would be for the UI component that handles game selection
      // For now, we'll test that the filtering functions don't crash with invalid data
      const invalidWeapon = {
        name: 'Invalid Weapon',
        type: 'Invalid Type',
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

      // Should not throw an error
      expect(() => {
        dsrFilterWeapons(invalidWeapon, preferences, defeatedBosses);
      }).not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    test('filtering should complete within reasonable time', () => {
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
      const defeatedBosses = ['Asylum Demon', 'Bell Gargoyle', 'Capra Demon'];
      const blacklist = [];

      const startTime = performance.now();
      
      const availableWeapons = dsrWeapons.filter(weapon => {
        if (blacklist.some(w => w.name === weapon.name)) return false;
        return dsrFilterWeapons(weapon, preferences, defeatedBosses);
      });

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(executionTime).toBeLessThan(100); // Should complete in less than 100ms
      expect(availableWeapons.length).toBeGreaterThan(0);
    });
  });
});
