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

// Functions to check if a boss is from specific DLC
export const isDlc1Boss = (bossName) => dlc1Bosses.includes(bossName);
export const isDlc2Boss = (bossName) => dlc2Bosses.includes(bossName);
export const isDlc3Boss = (bossName) => dlc3Bosses.includes(bossName);
