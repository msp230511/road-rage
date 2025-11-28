// Game Constants Configuration
export const GAME_CONFIG = {
  // Canvas and Layout
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 900,

  // Tile and Lane Settings
  TILE_HEIGHT: 50,
  TOTAL_TILES: 18,
  INITIAL_LANES: 3,
  EXPANDED_LANES: 5,
  LANE_EXPANSION_THRESHOLD: 2000,

  // Default Difficulty
  DEFAULT_SCROLL_SPEED: 3,
  DEFAULT_OBSTACLE_SPAWN_CHANCE: 0.02,

  // Spawn Rates
  SHIELD_SPAWN_CHANCE: 0.01,
  BOMB_SPAWN_CHANCE: 0.01,
  HEART_SPAWN_CHANCE: 0.002, // 1/5 of bomb spawn rate
  COIN_SPAWN_CHANCE: 0.002, // Same as hearts

  // Gameplay
  DEFAULT_HEALTH: 3,
  DANGER_ZONE_HEIGHT: 50, // For safe spawning
  BOOST_MULTIPLIER: 2,

  // Audio
  MUSIC_VOLUME: 0.5,
};

// Difficulty configuration - score thresholds and their settings
export const DIFFICULTY_CONFIG = {
  0: { speed: 5, spawnChance: 0.1 },
  200: { speed: 5, spawnChance: 0.1 },
  500: { speed: 8, spawnChance: 0.15 },
  1000: { speed: 10, spawnChance: 0.2 },
  1500: { speed: 10, spawnChance: 0.25 },
  2000: { speed: 10, spawnChance: 0.3 },
  2500: { speed: 14, spawnChance: 0.4 },
  3000: { speed: 16, spawnChance: 0.45 },
  3500: { speed: 18, spawnChance: 0.5 },
  4000: { speed: 20, spawnChance: 0.6 },
  4500: { speed: 20, spawnChance: 0.65 },
  5000: { speed: 20, spawnChance: 0.7 },
  5500: { speed: 22, spawnChance: 0.7 },
};

// Milestone sound triggers
export const MILESTONES = {
  1000: 'milestone1000Sound',
  2000: 'milestone2000Sound',
  3000: 'milestone3000Sound',
};

// Banana roast messages
export const BANANA_ROASTS = [
  "Why would you do that?",
  "Are you even trying?",
  "My grandma drives better than you!",
  "That was embarrassing...",
  "Did you close your eyes?",
  "You call that dodging?",
  "I've seen better from a blindfolded toddler!",
  "Maybe try using your eyes next time?",
  "That's gonna leave a mark... on your ego!",
  "Even I could've avoided that!",
  "Pathetic.",
  "Are you playing with your feet?",
  "This is painful to watch.",
  "Do you need glasses?",
  "Yikes.",
  "That was tragic.",
  "You're making this too easy for them!",
  "Is this your first time?",
  "Were you distracted by my good looks?",
  "Bro what the f*** was that?",
  "Holy s***, that was awful!",
  "You absolute muppet!",
  "Jesus Christ, pay attention!",
  "What the hell are you doing?!",
  "That was some next-level stupidity!",
  "Are you f***ing kidding me?",
  "Get good, scrub!",
  "You're an embarrassment!",
  "Uninstall, please.",
  "Delete your account.",
];

// LocalStorage keys
export const STORAGE_KEYS = {
  HIGH_SCORE: 'motorcycleHighScore',
  TOTAL_COINS: 'motorcycleTotalCoins',
  UNLOCKED_VEHICLES: 'motorcycleUnlockedVehicles',
  UNLOCKED_MODS: 'motorcycleUnlockedMods',
  ACHIEVEMENTS: 'motorcycleAchievements',
};
