#!/usr/bin/env node

import fs from 'fs';

// Function to extract weapons from a JS file
function extractWeaponsFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const arrayMatch = content.match(/export const allWeapons = \[([\s\S]*)\];/);
    if (!arrayMatch) {
        throw new Error(`Could not extract weapons array from ${filePath}`);
    }
    
    const arrayContent = '[' + arrayMatch[1] + ']';
    return eval(arrayContent);
}

// Read all three weapons files
console.log('Reading weapons files...');
const weapons = extractWeaponsFromFile('./src/games/dsr/weapons.js');
const mcWeapons = extractWeaponsFromFile('./src/games/dsr/dsr_mc_weapons.js');
const mergedWeapons = extractWeaponsFromFile('./src/games/dsr/weapons_merged.js');

console.log(`Found ${weapons.length} weapons in weapons.js`);
console.log(`Found ${mcWeapons.length} weapons in dsr_mc_weapons.js`);
console.log(`Found ${mergedWeapons.length} weapons in weapons_merged.js`);

// Create maps for easier lookup
const weaponsMap = new Map();
const mcWeaponsMap = new Map();
const mergedWeaponsMap = new Map();

weapons.forEach(weapon => {
    weaponsMap.set(weapon.name, weapon);
});

mcWeapons.forEach(weapon => {
    mcWeaponsMap.set(weapon.name, weapon);
});

mergedWeapons.forEach(weapon => {
    mergedWeaponsMap.set(weapon.name, weapon);
});

// Get weapons in the same order as weapons.js
const weaponsInOrder = weapons.map(weapon => weapon.name);

console.log(`\n=== THREE-WAY COMPARISON (in weapons.js order) ===`);
console.log(`Total weapons: ${weaponsInOrder.length}`);

// Function to format a weapon for display
function formatWeaponForDisplay(weapon, source) {
    if (!weapon) {
        return `[NOT FOUND in ${source}]`;
    }
    
    let output = `\n--- ${source} ---\n`;
    output += `Name: ${weapon.name}\n`;
    output += `Type: ${weapon.type}\n`;
    
    if (weapon.locations && weapon.locations.length > 0) {
        output += `Locations:\n`;
        weapon.locations.forEach((location, index) => {
            output += `  ${index + 1}. ${location}\n`;
        });
    }
    
    if (weapon.starting_class) {
        output += `Starting Class: ${weapon.starting_class}\n`;
    }
    if (weapon.starting_classes) {
        output += `Starting Classes: ${JSON.stringify(weapon.starting_classes)}\n`;
    }
    
    if (weapon.required_bosses) {
        output += `Required Bosses: ${JSON.stringify(weapon.required_bosses)}\n`;
    }
    
    if (weapon.required_bosses_with_farm) {
        output += `Required Bosses (Farm): ${JSON.stringify(weapon.required_bosses_with_farm)}\n`;
    }
    
    if (weapon.farmable_only !== undefined) {
        output += `Farmable Only: ${weapon.farmable_only}\n`;
    }
    
    if (weapon.not_guaranteed) {
        output += `Not Guaranteed: ${weapon.not_guaranteed}\n`;
    }
    
    if (weapon.black_knight_weapon) {
        output += `Black Knight Weapon: ${weapon.black_knight_weapon}\n`;
    }
    
    if (weapon.require_master_key !== undefined) {
        output += `Require Master Key: ${weapon.require_master_key}\n`;
    }
    
    return output;
}

// Function to check if two weapons have different requirements
function hasDifferentRequirements(weapon1, weapon2) {
    if (!weapon1 || !weapon2) return true;
    
    const bosses1 = weapon1.required_bosses ? JSON.stringify(weapon1.required_bosses.sort()) : '';
    const bosses2 = weapon2.required_bosses ? JSON.stringify(weapon2.required_bosses.sort()) : '';
    
    const bossesWithFarm1 = weapon1.required_bosses_with_farm ? JSON.stringify(weapon1.required_bosses_with_farm.sort()) : '';
    const bossesWithFarm2 = weapon2.required_bosses_with_farm ? JSON.stringify(weapon2.required_bosses_with_farm.sort()) : '';
    
    return bosses1 !== bosses2 || bossesWithFarm1 !== bossesWithFarm2;
}

// Show comparison for each weapon in weapons.js order
let weaponsWithDifferences = 0;
let weaponsOnlyInOneFile = 0;

weaponsInOrder.forEach((weaponName, index) => {
    const weapon1 = weaponsMap.get(weaponName);
    const weapon2 = mcWeaponsMap.get(weaponName);
    const mergedWeapon = mergedWeaponsMap.get(weaponName);
    
    const hasDifferences = hasDifferentRequirements(weapon1, weapon2);
    const onlyInOne = (!weapon1 && weapon2) || (weapon1 && !weapon2);
    
    // Show all weapons, but mark differences
    if (hasDifferences || onlyInOne) {
        weaponsWithDifferences++;
    }
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`WEAPON ${index + 1}: ${weaponName}${hasDifferences ? ' (DIFFERENT)' : ''}${onlyInOne ? ' (ONLY IN ONE FILE)' : ''}`);
    console.log(`${'='.repeat(80)}`);
    
    // Show original weapons.js version
    console.log(formatWeaponForDisplay(weapon1, 'weapons.js'));
    
    // Show dsr_mc_weapons.js version
    console.log(formatWeaponForDisplay(weapon2, 'dsr_mc_weapons.js'));
    
    // Show merged version
    console.log(formatWeaponForDisplay(mergedWeapon, 'weapons_merged.js'));
    
    if (onlyInOne) {
        weaponsOnlyInOneFile++;
    }
});

console.log(`\n${'='.repeat(80)}`);
console.log(`SUMMARY:`);
console.log(`Weapons with differences: ${weaponsWithDifferences}`);
console.log(`Weapons only in one file: ${weaponsOnlyInOneFile}`);
console.log(`Total weapons compared: ${weaponsInOrder.length}`);

// All weapons are now shown above in weapons.js order
