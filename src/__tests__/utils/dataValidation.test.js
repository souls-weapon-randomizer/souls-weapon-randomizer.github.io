import { allWeapons as dsrWeapons } from '../../games/dsr/weapons.js';
import { allWeapons as ds2Weapons } from '../../games/ds2/weapons.js';
import { allBosses as dsrBosses } from '../../games/dsr/bosses.js';
import { allBosses as ds2Bosses } from '../../games/ds2/bosses.js';

describe('Data Integrity Tests', () => {
  describe('DSR Weapon Data', () => {
    test('all weapons should have required fields', () => {
      dsrWeapons.forEach(weapon => {
        expect(weapon).toHaveProperty('name');
        expect(weapon).toHaveProperty('type');
        expect(weapon).toHaveProperty('img');
        expect(weapon).toHaveProperty('required_bosses');
        expect(weapon.name).toBeTruthy();
        expect(weapon.type).toBeTruthy();
        expect(weapon.img).toBeTruthy();
        expect(Array.isArray(weapon.required_bosses)).toBe(true);
      });
    });

    test('all weapons should have valid required_bosses structure', () => {
      dsrWeapons.forEach(weapon => {
        weapon.required_bosses.forEach(requirement => {
          expect(requirement).toHaveProperty('bosses');
          expect(requirement).toHaveProperty('farmable_only');
          expect(Array.isArray(requirement.bosses)).toBe(true);
          expect(typeof requirement.farmable_only).toBe('boolean');
          
          // Optional DSR-specific fields
          if (requirement.hasOwnProperty('black_knight_weapon')) {
            expect(typeof requirement.black_knight_weapon).toBe('boolean');
          }
          if (requirement.hasOwnProperty('not_guaranteed')) {
            expect(typeof requirement.not_guaranteed).toBe('boolean');
          }
          if (requirement.hasOwnProperty('require_master_key')) {
            expect(typeof requirement.require_master_key).toBe('boolean');
          }
        });
      });
    });

    test('all weapon images should have valid paths', () => {
      dsrWeapons.forEach(weapon => {
        expect(weapon.img).toMatch(/^\/dsr_weapon_images\/.*\.png$/);
      });
    });

    test('no duplicate weapon names should exist', () => {
      const names = dsrWeapons.map(weapon => weapon.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });

    test('weapon types should be valid', () => {
      const validTypes = [
        'Sword', 'Straight Sword', 'Greatsword', 'Ultra Greatsword', 'Dagger', 'Rapier', 'Piercing Sword', 'Curved Sword',
        'Curved Greatsword', 'Katana', 'Bow', 'Crossbow', 'Greatbow', 'Axe', 'Greataxe', 'Great Axe',
        'Hammer', 'Great Hammer', 'Spear', 'Halberd', 'Whip', 'Fist & Claw', 'Pyromancy Flame',
        'Catalyst', 'Talisman', 'Consumable'
      ];
      
      dsrWeapons.forEach(weapon => {
        expect(validTypes).toContain(weapon.type);
      });
    });
  });

  describe('DS2 Weapon Data', () => {
    test('all weapons should have required fields', () => {
      ds2Weapons.forEach(weapon => {
        expect(weapon).toHaveProperty('name');
        expect(weapon).toHaveProperty('type');
        expect(weapon).toHaveProperty('img');
        expect(weapon).toHaveProperty('required_bosses');
        expect(weapon.name).toBeTruthy();
        expect(weapon.type).toBeTruthy();
        expect(weapon.img).toBeTruthy();
        expect(Array.isArray(weapon.required_bosses)).toBe(true);
      });
    });

    test('all weapons should have valid required_bosses structure', () => {
      ds2Weapons.forEach(weapon => {
        weapon.required_bosses.forEach(requirement => {
          expect(requirement).toHaveProperty('bosses');
          expect(Array.isArray(requirement.bosses)).toBe(true);
          
          // Optional fields
          if (requirement.hasOwnProperty('farmable_only')) {
            expect(typeof requirement.farmable_only).toBe('boolean');
          }
          if (requirement.hasOwnProperty('crows_only')) {
            expect(typeof requirement.crows_only).toBe('boolean');
          }
          if (requirement.hasOwnProperty('bonfire_ascetic_required')) {
            expect(typeof requirement.bonfire_ascetic_required).toBe('boolean');
          }
        });
      });
    });

    test('all weapon images should have valid paths', () => {
      ds2Weapons.forEach(weapon => {
        expect(weapon.img).toMatch(/^\/ds2_weapon_images\/.*\.png$/);
      });
    });

    test('no duplicate weapon names should exist', () => {
      const names = ds2Weapons.map(weapon => weapon.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });

    test('DS2 weapons should not have DSR-specific fields', () => {
      ds2Weapons.forEach(weapon => {
        expect(weapon).not.toHaveProperty('black_knight_weapon');
        expect(weapon).not.toHaveProperty('not_guaranteed');
        expect(weapon).not.toHaveProperty('require_master_key');
      });
    });

    test('DS2 weapons should have DS2-specific fields when applicable', () => {
      const weaponsWithCrows = ds2Weapons.filter(weapon => weapon.crows_only);
      const weaponsWithBonfire = ds2Weapons.filter(weapon => weapon.bonfire_ascetic_required);
      
      weaponsWithCrows.forEach(weapon => {
        expect(typeof weapon.crows_only).toBe('boolean');
      });
      
      weaponsWithBonfire.forEach(weapon => {
        expect(typeof weapon.bonfire_ascetic_required).toBe('boolean');
      });
    });
  });

  describe('DSR Boss Data', () => {
    test('all bosses should be strings', () => {
      dsrBosses.forEach(boss => {
        expect(typeof boss).toBe('string');
        expect(boss).toBeTruthy();
      });
    });

    test('no duplicate boss names should exist', () => {
      const uniqueNames = new Set(dsrBosses);
      expect(dsrBosses.length).toBe(uniqueNames.size);
    });

    test('all bosses referenced in weapons should exist in boss data', () => {
      const bossNames = new Set(dsrBosses);
      
      dsrWeapons.forEach(weapon => {
        weapon.required_bosses.forEach(requirement => {
          requirement.bosses.forEach(bossName => {
            expect(bossNames.has(bossName)).toBe(true);
          });
        });
      });
    });
  });

  describe('DS2 Boss Data', () => {
    test('all bosses should be strings', () => {
      ds2Bosses.forEach(boss => {
        expect(typeof boss).toBe('string');
        expect(boss).toBeTruthy();
      });
    });

    test('no duplicate boss names should exist', () => {
      const uniqueNames = new Set(ds2Bosses);
      expect(ds2Bosses.length).toBe(uniqueNames.size);
    });

    test('all bosses referenced in weapons should exist in boss data', () => {
      const bossNames = new Set(ds2Bosses);
      
      ds2Weapons.forEach(weapon => {
        weapon.required_bosses.forEach(requirement => {
          requirement.bosses.forEach(bossName => {
            expect(bossNames.has(bossName)).toBe(true);
          });
        });
      });
    });
  });

  describe('Cross-Game Data Consistency', () => {
    test('weapon names can be duplicated between games (different games)', () => {
      const dsrNames = new Set(dsrWeapons.map(weapon => weapon.name));
      const ds2Names = new Set(ds2Weapons.map(weapon => weapon.name));
      
      const intersection = new Set([...dsrNames].filter(name => ds2Names.has(name)));
      // It's OK to have some duplicate names between different games
      expect(intersection.size).toBeGreaterThanOrEqual(0);
    });

    test('boss names should be different between games', () => {
      const dsrBossNames = new Set(dsrBosses);
      const ds2BossNames = new Set(ds2Bosses);
      
      // Check that boss names don't overlap between games (they should be different)
      const intersection = new Set([...dsrBossNames].filter(name => ds2BossNames.has(name)));
      expect(intersection.size).toBe(0);
    });
  });

  describe('Starting Classes Data', () => {
    test('DSR starting classes should be valid', () => {
      const validClasses = ['Warrior', 'Knight', 'Wanderer', 'Thief', 'Bandit', 'Hunter', 'Sorcerer', 'Pyromancer', 'Cleric', 'Deprived'];
      
      dsrWeapons.forEach(weapon => {
        if (weapon.starting_classes) {
          weapon.starting_classes.forEach(className => {
            expect(validClasses).toContain(className);
          });
        }
      });
    });

    test('DS2 starting classes should be valid', () => {
      const validClasses = ['Warrior', 'Knight', 'Swordsman', 'Bandit', 'Cleric', 'Sorcerer', 'Explorer', 'Deprived'];
      
      ds2Weapons.forEach(weapon => {
        if (weapon.starting_classes) {
          weapon.starting_classes.forEach(className => {
            expect(validClasses).toContain(className);
          });
        }
      });
    });
  });
});
