// DLC bosses from Artorias of the Abyss
export const dlcBosses = [
    "Sanctuary Guardian",
    "Black Dragon Kalameet", 
    "Artorias the Abysswalker",
    "Manus, Father of the Abyss"
];

// Function to check if a boss is from DLC
export const isDlcBoss = (bossName) => dlcBosses.includes(bossName);
