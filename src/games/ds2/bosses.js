

export const allBosses = [
    "The Last Giant",
    "The Pursuer",
    "Dragonrider",
    "Old Dragonslayer",
    "Flexile Sentry",
    "Ruin Sentinel",
    "Belfry Gargoyles",
    "Lost Sinner",
    "The Skeleton Lords",
    "Executioner's Chariot",
    "Covetous Demon",
    "Mytha, the Baneful Queen",
    "Smelter Demon",
    "Old Iron King",
    "Royal Rat Vanguard",
    "The Rotten",
    "Scorpioness Najka",
    "Royal Rat Authority",
    "Prowling Magus and Congregation",
    "The Duke's Dear Freja",
    "Twin Dragonrider",
    "Looking Glass Knight",
    "Demon of Song",
    "Velstadt, the Royal Aegis",
    "Giant Lord",
    "Vendrick",
    "Guardian Dragon",
    "Ancient Dragon",
    "Darklurker",
    "Throne Watcher and Throne Defender",
    "Nashandra",
    "Aldia, Scholar of the First Sin",
    "Graverobber, Varg, and Cerah",
    "Elana, Squalid Queen",
    "Sinh, the Slumbering Dragon",
    "Blue Smelter Demon",
    "Fume Knight",
    "Sir Alonne",
    "Aava, the King's Pet",
    "Lud and Zallen, the King's Pets",
    "Burnt Ivory King"
];

export const startingClasses = [
    "Warrior", "Knight", "Swordsman", "Bandit", "Cleric", "Sorcerer", "Explorer", "Deprived"
];

// DLC bosses from Crown of the Sunken King
export const dlc1Bosses = [
    "Graverobber, Varg, and Cerah",
    "Elana, Squalid Queen",
    "Sinh, the Slumbering Dragon"
];

// DLC bosses from Crown of the Old Iron King
export const dlc2Bosses = [
    "Blue Smelter Demon",
    "Fume Knight",
    "Sir Alonne"
];

// DLC bosses from Crown of the Ivory King
export const dlc3Bosses = [
    "Aava, the King's Pet",
    "Lud and Zallen, the King's Pets",
    "Burnt Ivory King"
];

// Function to check if a boss is from DLC
export const isDlc1Boss = (bossName) => dlc1Bosses.includes(bossName);
export const isDlc2Boss = (bossName) => dlc2Bosses.includes(bossName);
export const isDlc3Boss = (bossName) => dlc3Bosses.includes(bossName);