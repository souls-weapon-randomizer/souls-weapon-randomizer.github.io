export const allBosses = [
    "Asylum Demon",
    "Taurus Demon",
    "Bell Gargoyle",
    "Moonlight Butterfly",
    "Capra Demon",
    "Gaping Dragon",
    "Chaos Witch Quelaag",
    "Iron Golem",
    "Dark Sun Gwyndolin",
    "Crossbreed Priscilla",
    "Ornstein and Smough",
    "Stray Demon",
    "Ceaseless Discharge",
    "Demon Firesage",
    "Centipede Demon",
    "The Bed of Chaos",
    "Pinwheel",
    "Nito",
    "Seath the Scaleless",
    "Great Grey Wolf Sif",
    "Four Kings",
    "Sanctuary Guardian",
    "Black Dragon Kalameet",
    "Artorias the Abysswalker",
    "Manus, Father of the Abyss",
    "Gwyn Lord of Cinder",
];

export const startingClasses = [
    "Warrior", "Knight", "Wanderer", "Thief", "Bandit", "Hunter", "Sorcerer", "Pyromancer", "Cleric", "Deprived"
];

// DLC bosses from Artorias of the Abyss
export const dlcBosses = [
    "Sanctuary Guardian",
    "Black Dragon Kalameet", 
    "Artorias the Abysswalker",
    "Manus, Father of the Abyss"
];

// Function to check if a boss is from DLC
export const isDlcBoss = (bossName) => dlcBosses.includes(bossName);
