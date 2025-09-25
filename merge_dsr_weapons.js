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

// Read both DSR weapons files
const weapons1 = extractWeaponsFromFile('./src/games/dsr/weapons.js');
const weapons2 = extractWeaponsFromFile('./src/games/dsr/dsr_mc_weapons.js');

console.log(`Found ${weapons1.length} weapons in weapons.js`);
console.log(`Found ${weapons2.length} weapons in dsr_mc_weapons.js`);

// Create maps for easier lookup
const weapons1Map = new Map();
const weapons2Map = new Map();

weapons1.forEach(weapon => {
    weapons1Map.set(weapon.name, weapon);
});

weapons2.forEach(weapon => {
    weapons2Map.set(weapon.name, weapon);
});

// Function to convert a single weapon to DS2 format
function convertWeapon(weapon, isFromMC = false) {
    const newWeapon = {
        name: weapon.name,
        locations: weapon.locations,
        img: weapon.img,
        type: weapon.type,
        wiki_url: weapon.wiki_url,
        required_bosses: []
    };

    // Convert starting_class to starting_classes array
    if (weapon.starting_class) {
        newWeapon.starting_classes = [weapon.starting_class];
    }

    // Add not_guaranteed if present
    if (weapon.not_guaranteed) {
        newWeapon.not_guaranteed = weapon.not_guaranteed;
    }

    // Add black_knight_weapon if present
    if (weapon.black_knight_weapon) {
        newWeapon.black_knight_weapon = weapon.black_knight_weapon;
    }

    // Convert required_bosses (non-farmable)
    if (weapon.required_bosses && Array.isArray(weapon.required_bosses)) {
        newWeapon.required_bosses.push({
            bosses: weapon.required_bosses,
            farmable_only: false,
            require_master_key: isFromMC
        });
    }

    // Convert required_bosses_with_farm (farmable)
    if (weapon.required_bosses_with_farm && Array.isArray(weapon.required_bosses_with_farm)) {
        newWeapon.required_bosses.push({
            bosses: weapon.required_bosses_with_farm,
            farmable_only: true,
            require_master_key: isFromMC
        });
    }

    return newWeapon;
}

// Function to merge two weapons with the same name
function mergeWeapons(weapon1, weapon2) {
    const merged = {
        name: weapon1.name,
        locations: weapon1.locations,
        img: weapon1.img,
        type: weapon1.type,
        wiki_url: weapon1.wiki_url,
        required_bosses: []
    };

    // Copy starting_classes from weapon1
    if (weapon1.starting_class) {
        merged.starting_classes = [weapon1.starting_class];
    }

    // Copy flags from weapon1
    if (weapon1.not_guaranteed) {
        merged.not_guaranteed = weapon1.not_guaranteed;
    }
    if (weapon1.black_knight_weapon) {
        merged.black_knight_weapon = weapon1.black_knight_weapon;
    }

    // Add required_bosses from weapon1 (non-farmable)
    if (weapon1.required_bosses && Array.isArray(weapon1.required_bosses)) {
        var new_weapon = {
            bosses: weapon1.required_bosses,
        }
        if (weapon1.farmable_only) {
            new_weapon.farmable_only = weapon1.farmable_only;
        }
        else {
            new_weapon.farmable_only = false;
        }
        if (weapon1.not_guaranteed) {
            new_weapon.not_guaranteed = weapon1.not_guaranteed;
        }
        if (weapon1.black_knight_weapon) {
            new_weapon.black_knight_weapon = weapon1.black_knight_weapon;
        }
        merged.required_bosses.push(new_weapon);
    }

    // Add required_bosses_with_farm from weapon1 (farmable)
    if (weapon1.required_bosses_with_farm && Array.isArray(weapon1.required_bosses_with_farm)) {
        var new_weapon = {
            bosses: weapon1.required_bosses_with_farm,
        }
        if (weapon1.not_guaranteed) {
            new_weapon.not_guaranteed = weapon1.not_guaranteed;
        }
        if (weapon1.black_knight_weapon) {
            new_weapon.black_knight_weapon = weapon1.black_knight_weapon;
        }
        new_weapon.farmable_only = true;
        merged.required_bosses.push(new_weapon);
    }

    // Add required_bosses from weapon2 (MC version - non-farmable) only if different from weapon1
    if (weapon2.required_bosses && Array.isArray(weapon2.required_bosses)) {
        // Check if the arrays are different by comparing their stringified versions
        const weapon1Bosses = weapon1.required_bosses ? JSON.stringify(weapon1.required_bosses.sort()) : '';
        const weapon2Bosses = JSON.stringify(weapon2.required_bosses.sort());
        
        if (weapon1Bosses !== weapon2Bosses) {
            var new_weapon = {
                bosses: weapon2.required_bosses,
            }
            if (weapon2.farmable_only) {
                new_weapon.farmable_only = weapon2.farmable_only;
            }
            else {
                new_weapon.farmable_only = false;
            }
            if (weapon2.not_guaranteed) {
                new_weapon.not_guaranteed = weapon2.not_guaranteed;
            }
            if (weapon2.black_knight_weapon) {
                new_weapon.black_knight_weapon = weapon2.black_knight_weapon;
            }
            new_weapon.require_master_key = true;
            merged.required_bosses.push(new_weapon);
        }
    }

    // Add required_bosses_with_farm from weapon2 (MC version - farmable) only if different from weapon1
    if (weapon2.required_bosses_with_farm && Array.isArray(weapon2.required_bosses_with_farm)) {
        // Check if the arrays are different by comparing their stringified versions
        const weapon1BossesWithFarm = weapon1.required_bosses_with_farm ? JSON.stringify(weapon1.required_bosses_with_farm.sort()) : '';
        const weapon2BossesWithFarm = JSON.stringify(weapon2.required_bosses_with_farm.sort());
        
        if (weapon1BossesWithFarm !== weapon2BossesWithFarm) {
            var new_weapon = {
                bosses: weapon2.required_bosses_with_farm,
            }
            if (weapon2.not_guaranteed) {
                new_weapon.not_guaranteed = weapon2.not_guaranteed;
            }
            if (weapon2.black_knight_weapon) {
                new_weapon.black_knight_weapon = weapon2.black_knight_weapon;
            }
            new_weapon.require_master_key = true;
            new_weapon.farmable_only = true;
            merged.required_bosses.push(new_weapon);
        }
    }

    return merged;
}

// Process all weapons
const allWeaponNames = new Set([...weapons1Map.keys(), ...weapons2Map.keys()]);
const mergedWeapons = [];

allWeaponNames.forEach(weaponName => {
    const weapon1 = weapons1Map.get(weaponName);
    const weapon2 = weapons2Map.get(weaponName);

    if (weapon1 && weapon2) {
        // Both files have this weapon - merge them
        mergedWeapons.push(mergeWeapons(weapon1, weapon2));
    } else if (weapon1) {
        // Only in weapons.js
        mergedWeapons.push(convertWeapon(weapon1, false));
    } else if (weapon2) {
        // Only in dsr_mc_weapons.js
        mergedWeapons.push(convertWeapon(weapon2, true));
    }
});

console.log(`Total merged weapons: ${mergedWeapons.length}`);

// Create the new file content with proper formatting
let newFileContent = 'export const allWeapons = [\n';

mergedWeapons.forEach((weapon, index) => {
    newFileContent += '    {\n';
    newFileContent += `        "name": ${JSON.stringify(weapon.name)},\n`;
    
    // Format locations
    newFileContent += '        "locations": [\n';
    weapon.locations.forEach((location, locIndex) => {
        newFileContent += `            ${JSON.stringify(location)}${locIndex < weapon.locations.length - 1 ? ',' : ''}\n`;
    });
    newFileContent += '        ],\n';
    
    newFileContent += `        "img": ${JSON.stringify(weapon.img)},\n`;
    newFileContent += `        "type": ${JSON.stringify(weapon.type)},\n`;
    newFileContent += `        "wiki_url": ${JSON.stringify(weapon.wiki_url)},\n`;
    
    // Format required_bosses with proper spacing
    newFileContent += '        "required_bosses": [\n';
    weapon.required_bosses.forEach((bossEntry, bossIndex) => {
        const bossesArray = JSON.stringify(bossEntry.bosses).replace(/\[/g, '[').replace(/\]/g, ']');
        let bossString = `{"bosses": ${bossesArray}, "farmable_only": ${bossEntry.farmable_only}`;
        
        if (bossEntry.require_master_key) {
            bossString += `, "require_master_key": true`;
        }
        
        bossString += '}';
        newFileContent += `            ${bossString}${bossIndex < weapon.required_bosses.length - 1 ? ',' : ''}\n`;
    });
    newFileContent += '        ]';
    
    // Add starting_classes if it exists
    if (weapon.starting_classes) {
        newFileContent += `,\n        "starting_classes": ${JSON.stringify(weapon.starting_classes)}`;
    }

    // Add not_guaranteed if it exists
    if (weapon.not_guaranteed) {
        newFileContent += `,\n        "not_guaranteed": ${weapon.not_guaranteed}`;
    }

    // Add black_knight_weapon if it exists
    if (weapon.black_knight_weapon) {
        newFileContent += `,\n        "black_knight_weapon": ${weapon.black_knight_weapon}`;
    }
    
    newFileContent += `\n    }${index < mergedWeapons.length - 1 ? ',' : ''}\n`;
});

newFileContent += '];\n';

// Write the new file
const outputPath = './src/games/dsr/weapons_merged.js';
fs.writeFileSync(outputPath, newFileContent);

console.log(`Merged weapons written to ${outputPath}`);

// Show a sample of the merged format
console.log('\nSample merged weapon:');
console.log(JSON.stringify(mergedWeapons[0], null, 2));
