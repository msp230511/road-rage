const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const healthDisplay = document.getElementById("health");
const scoreDisplay = document.getElementById("score");
const coinsDisplay = document.getElementById("coins");
const gameOverScreen = document.getElementById("gameOver");
const finalScoreDisplay = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");
const pauseBtn = document.getElementById("pauseBtn");
const coinSound = document.getElementById("coinSound");
const explosionSound = document.getElementById("explosionSound");
const hitmarkerSound = document.getElementById("hitmarkerSound");
const bubbleSound = document.getElementById("bubbleSound");
const pauseMenuSound = document.getElementById("pauseMenuSound");
const heroesNeverDieSound = document.getElementById("heroesNeverDieSound");
const heartPickupSound = document.getElementById("heartPickupSound");
const milestone1000Sound = document.getElementById("milestone1000Sound");
const milestone2000Sound = document.getElementById("milestone2000Sound");
const milestone3000Sound = document.getElementById("milestone3000Sound");

// Game over sound effects array
const gameOverSounds = [
  document.getElementById("gameOverSound1"),
  document.getElementById("gameOverSound2"),
  document.getElementById("gameOverSound4"),
  document.getElementById("gameOverSound5"),
  document.getElementById("gameOverSound6"),
  document.getElementById("gameOverSound7"),
  document.getElementById("gameOverSound8"),
  document.getElementById("gameOverSound9"),
];

// Menu elements
const menuScreen = document.getElementById("menuScreen");
const startGameBtn = document.getElementById("startGameBtn");
const pauseMenu = document.getElementById("pauseMenu");
const resumeBtn = document.getElementById("resumeBtn");
const menuBtn = document.getElementById("menuBtn");
const menuFromGameOverBtn = document.getElementById("menuFromGameOverBtn");
const menuCoinsDisplay = document.getElementById("menuCoins");

// Things To Know elements
const thingsToKnowBtn = document.getElementById("thingsToKnowBtn");
const thingsToKnowOverlay = document.getElementById("thingsToKnowOverlay");
const closeThingsToKnowBtn = document.getElementById("closeThingsToKnowBtn");

// Achievements screen elements
const achievementsBtn = document.getElementById("achievementsBtn");
const achievementsScreen = document.getElementById("achievementsScreen");
const achievementsCoinsDisplay = document.getElementById("achievementsCoins");
const backToMenuFromAchievements = document.getElementById(
  "backToMenuFromAchievements"
);
const unlockedAchievementsList = document.getElementById(
  "unlockedAchievements"
);
const lockedAchievementsList = document.getElementById("lockedAchievements");

// Modification screen elements
const modScreen = document.getElementById("modScreen");
const backToMenuBtn = document.getElementById("backToMenuBtn");
const modCoinsDisplay = document.getElementById("modCoins");
const modVehicleName = document.getElementById("modVehicleName");
const modVehicleCanvas = document.getElementById("modVehicleCanvas");
let currentModVehicle = "motorcycle"; // Track which vehicle is being modified

// Banana roast elements
const bananaSpeechBubble = document.getElementById("bananaSpeechBubble");
const roastText = document.getElementById("roastText");
let roastTimeout = null;

// Achievement elements
const achievementContainer = document.getElementById("achievementContainer");

// Debug mode elements
const debugOverlay = document.getElementById("debugOverlay");
const debugHealthInput = document.getElementById("debugHealthInput");
const debugApplyHealthBtn = document.getElementById("debugApplyHealthBtn");
const debugCoinsInput = document.getElementById("debugCoinsInput");
const debugAddCoinsBtn = document.getElementById("debugAddCoinsBtn");
const debugResetCoinsBtn = document.getElementById("debugResetCoinsBtn");
const debugResetVehiclesBtn = document.getElementById("debugResetVehiclesBtn");
const debugResetAchievementsBtn = document.getElementById(
  "debugResetAchievementsBtn"
);
const debugStatus = document.getElementById("debugStatus");
const debugInvincibilityCheckbox = document.getElementById(
  "debugInvincibilityCheckbox"
);

// Debug mode state
let debugMode = {
  active: false,
  keysPressed: new Set(),
  customStartHealth: null, // null means use default/mod-based health
  invincibility: false, // Invincibility mode
};

// Array of roasts the banana man says when you take damage
const BANANA_ROASTS = [
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

// Achievement definitions
const ACHIEVEMENTS = {
  idiot: {
    id: "idiot",
    name: "Idiot",
    description: "Die without scoring any points",
    unlocked: false,
  },
  demolitionist: {
    id: "demolitionist",
    name: "Demolitionist",
    description: "Die 3 times in a row due to a bomb",
    unlocked: false,
  },
  kindaCrazy: {
    id: "kindaCrazy",
    name: "Kinda Crazy",
    description: "Take no damage until 500 score",
    unlocked: false,
  },
  touchGrass: {
    id: "touchGrass",
    name: "Touch Grass",
    description: "Take no damage until 1000 score",
    unlocked: false,
  },
  noLife: {
    id: "noLife",
    name: "No Life",
    description: "Reach 10000 score",
    unlocked: false,
  },
  lovesCardio: {
    id: "lovesCardio",
    name: "Loves Cardio",
    description: "Hit a balance of 10 hearts in any game",
    unlocked: false,
  },
  uncleScrooge: {
    id: "uncleScrooge",
    name: "Uncle Scrooge",
    description: "Collect 25 coins in one game",
    unlocked: false,
  },
};

// Load achievements from localStorage
function loadAchievements() {
  const saved = localStorage.getItem("motorcycleAchievements");
  if (saved) {
    const savedAchievements = JSON.parse(saved);
    // Merge saved achievements with default achievements
    Object.keys(ACHIEVEMENTS).forEach((key) => {
      if (savedAchievements[key]) {
        ACHIEVEMENTS[key].unlocked = savedAchievements[key].unlocked;
      }
    });
  }
}

// Save achievements to localStorage
function saveAchievements() {
  localStorage.setItem("motorcycleAchievements", JSON.stringify(ACHIEVEMENTS));
}

// Check if an achievement is unlocked
function isAchievementUnlocked(achievementId) {
  return ACHIEVEMENTS[achievementId]?.unlocked || false;
}

// Unlock an achievement and show notification
function unlockAchievement(achievementId) {
  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement || achievement.unlocked) return;

  achievement.unlocked = true;
  saveAchievements();
  showAchievementNotification(achievement);
}

// Game constants
const TILE_HEIGHT = 50;
const TOTAL_TILES = 18;
const INITIAL_LANES = 3;
const EXPANDED_LANES = 5;
const LANE_EXPANSION_THRESHOLD = 2000; // Score threshold for lane expansion

// Default difficulty settings
const DEFAULT_SCROLL_SPEED = 3;
const DEFAULT_OBSTACLE_SPAWN_CHANCE = 0.02;
const SHIELD_SPAWN_CHANCE = 0.01; // 0.5% chance per frame (rare)
const BOMB_SPAWN_CHANCE = 0.01; // 0.1% chance per frame (very rare)
const HEART_SPAWN_CHANCE = BOMB_SPAWN_CHANCE / 5; // 1/3 the frequency of bombs
const COIN_SPAWN_CHANCE = HEART_SPAWN_CHANCE; // Same rate as hearts

// Difficulty configuration - score thresholds and their settings
const DIFFICULTY_CONFIG = {
  0: { speed: 5, spawnChance: 0.1 }, // Starting difficulty
  200: { speed: 5, spawnChance: 0.1 }, // First threshold
  500: { speed: 8, spawnChance: 0.15 }, // Second threshold
  1000: { speed: 10, spawnChance: 0.2 }, // Third threshold
  1500: { speed: 10, spawnChance: 0.25 },
  2000: { speed: 10, spawnChance: 0.3 },
  2500: { speed: 14, spawnChance: 0.4 },
  3000: { speed: 16, spawnChance: 0.45 },
  3500: { speed: 18, spawnChance: 0.5 },
  4000: { speed: 18, spawnChance: 0.5 }, // Max difficulty
  4500: { speed: 18, spawnChance: 0.5 },
  5000: { speed: 18, spawnChance: 0.5 },
  5500: { speed: 18, spawnChance: 0.5 },
  6000: { speed: 18, spawnChance: 0.6 },
  6500: { speed: 18, spawnChance: 0.6 },
  7000: { speed: 18, spawnChance: 0.6 },
  7500: { speed: 20, spawnChance: 0.6 },
  8000: { speed: 20, spawnChance: 0.6 },
  8500: { speed: 20, spawnChance: 0.6 },
  9000: { speed: 20, spawnChance: 0.6 },
  9500: { speed: 20, spawnChance: 0.6 },
  10000: { speed: 20, spawnChance: 0.7 }, // Beyond max difficulty
};

// Vehicle types with drawing functions
const VEHICLES = {
  motorcycle: {
    name: "MOTORCYCLE",
    draw: function (context, x, y, scale = 1) {
      // Motorcycle body
      context.fillStyle = "#3498db";
      context.beginPath();
      context.moveTo(x, y - 20 * scale);
      context.lineTo(x - 15 * scale, y + 15 * scale);
      context.lineTo(x + 15 * scale, y + 15 * scale);
      context.closePath();
      context.fill();

      // Wheels
      context.fillStyle = "#2c3e50";
      context.beginPath();
      context.arc(x - 8 * scale, y + 12 * scale, 5 * scale, 0, Math.PI * 2);
      context.arc(x + 8 * scale, y + 12 * scale, 5 * scale, 0, Math.PI * 2);
      context.fill();

      // Rider
      context.fillStyle = "#e67e22";
      context.beginPath();
      context.arc(x, y - 5 * scale, 8 * scale, 0, Math.PI * 2);
      context.fill();
    },
  },
  car: {
    name: "SPORTS CAR",
    draw: function (context, x, y, scale = 1) {
      // Car body (sleek sports car shape)
      context.fillStyle = "#e74c3c";
      context.fillRect(x - 18 * scale, y - 10 * scale, 36 * scale, 30 * scale);

      // Car hood (front triangle)
      context.fillStyle = "#c0392b";
      context.beginPath();
      context.moveTo(x, y - 20 * scale);
      context.lineTo(x - 18 * scale, y - 10 * scale);
      context.lineTo(x + 18 * scale, y - 10 * scale);
      context.closePath();
      context.fill();

      // Windshield
      context.fillStyle = "#3498db";
      context.fillRect(x - 12 * scale, y - 5 * scale, 24 * scale, 12 * scale);

      // Wheels
      context.fillStyle = "#2c3e50";
      context.fillRect(x - 20 * scale, y + 15 * scale, 8 * scale, 8 * scale);
      context.fillRect(x + 12 * scale, y + 15 * scale, 8 * scale, 8 * scale);

      // Spoiler
      context.fillStyle = "#2c3e50";
      context.fillRect(x - 15 * scale, y + 18 * scale, 30 * scale, 3 * scale);
    },
  },
  truck: {
    name: "MONSTER TRUCK",
    draw: function (context, x, y, scale = 1) {
      // Truck bed (back)
      context.fillStyle = "#f39c12";
      context.fillRect(x - 20 * scale, y + 5 * scale, 40 * scale, 15 * scale);

      // Truck cab (front)
      context.fillStyle = "#e67e22";
      context.fillRect(x - 18 * scale, y - 15 * scale, 36 * scale, 20 * scale);

      // Cab roof
      context.fillStyle = "#d35400";
      context.fillRect(x - 15 * scale, y - 20 * scale, 30 * scale, 5 * scale);

      // Windshield
      context.fillStyle = "#3498db";
      context.fillRect(x - 12 * scale, y - 12 * scale, 24 * scale, 8 * scale);

      // Monster truck wheels (huge)
      context.fillStyle = "#2c3e50";
      context.beginPath();
      context.arc(x - 15 * scale, y + 20 * scale, 10 * scale, 0, Math.PI * 2);
      context.arc(x + 15 * scale, y + 20 * scale, 10 * scale, 0, Math.PI * 2);
      context.fill();

      // Wheel rims
      context.fillStyle = "#7f8c8d";
      context.beginPath();
      context.arc(x - 15 * scale, y + 20 * scale, 5 * scale, 0, Math.PI * 2);
      context.arc(x + 15 * scale, y + 20 * scale, 5 * scale, 0, Math.PI * 2);
      context.fill();
    },
  },
};

// Load high score from localStorage
function loadHighScore() {
  const saved = localStorage.getItem("motorcycleHighScore");
  return saved ? parseInt(saved, 10) : 0;
}

// Save high score to localStorage
function saveHighScore(score) {
  localStorage.setItem("motorcycleHighScore", score.toString());
}

// Load total coins from localStorage
function loadTotalCoins() {
  const saved = localStorage.getItem("motorcycleTotalCoins");
  return saved ? parseInt(saved, 10) : 0;
}

// Save total coins to localStorage
function saveTotalCoins(coins) {
  localStorage.setItem("motorcycleTotalCoins", coins.toString());
}

// Vehicle unlock prices
const VEHICLE_PRICES = {
  motorcycle: 0, // Free by default
  car: 50,
  truck: 100,
};

// Vehicle modifications configuration
const VEHICLE_MODS = {
  motorcycle: [
    {
      id: "mod1",
      name: "Shield Start",
      price: 15,
      description: "Start each life with a shield",
      effect: "startWithShield",
    },
    {
      id: "mod2",
      name: "Heart Boost",
      price: 30,
      description: "Hearts spawn 50% more often",
      effect: "heartSpawnBoost",
    },
    {
      id: "mod3",
      name: "Second Chance",
      price: 60,
      description: "20% chance to survive fatal hit",
      effect: "survivalChance20",
    },
  ],
  car: [
    {
      id: "mod1",
      name: "Turbo Boost",
      price: 10,
      description: "50% faster boost speed",
      effect: "boostSpeed25",
    },
    {
      id: "mod2",
      name: "Double Money",
      price: 35,
      description: "Coins are worth 2x",
      effect: "coinValue2x",
    },
    {
      id: "mod3",
      name: "Score Master",
      price: 50,
      description: "Score multiplier 1.5x",
      effect: "scoreMultiplier1_5x",
    },
  ],
  truck: [
    {
      id: "mod1",
      name: "Time Lord",
      price: 35,
      description: "Start with 5 hearts instead of 3",
      effect: "maxHealth5",
    },
    {
      id: "mod2",
      name: "Reinforced Shield",
      price: 45,
      description: "Shields protect against 2 hits",
      effect: "shieldDoubleHit",
    },
    {
      id: "mod3",
      name: "Tank Mode",
      price: 65,
      description: "35% chance to survive fatal hit",
      effect: "survivalChance35",
    },
  ],
};

// Load unlocked vehicles from localStorage
function loadUnlockedVehicles() {
  const saved = localStorage.getItem("motorcycleUnlockedVehicles");
  return saved ? JSON.parse(saved) : ["motorcycle"]; // Motorcycle is unlocked by default
}

// Save unlocked vehicles to localStorage
function saveUnlockedVehicles(unlockedVehicles) {
  localStorage.setItem(
    "motorcycleUnlockedVehicles",
    JSON.stringify(unlockedVehicles)
  );
}

// Check if a vehicle is unlocked
function isVehicleUnlocked(vehicleType) {
  return unlockedVehicles.includes(vehicleType);
}

// Unlock a vehicle
function unlockVehicle(vehicleType) {
  if (!isVehicleUnlocked(vehicleType)) {
    unlockedVehicles.push(vehicleType);
    saveUnlockedVehicles(unlockedVehicles);
  }
}

// Load unlocked mods for all vehicles from localStorage
function loadUnlockedMods() {
  const saved = localStorage.getItem("motorcycleUnlockedMods");
  return saved
    ? JSON.parse(saved)
    : {
        motorcycle: [],
        car: [],
        truck: [],
      };
}

// Save unlocked mods to localStorage
function saveUnlockedMods(unlockedMods) {
  localStorage.setItem("motorcycleUnlockedMods", JSON.stringify(unlockedMods));
}

// Check if a specific mod is unlocked for a vehicle
function isModUnlocked(vehicleType, modId) {
  return unlockedMods[vehicleType]?.includes(modId) || false;
}

// Unlock a mod for a vehicle
function unlockMod(vehicleType, modId) {
  if (!isModUnlocked(vehicleType, modId)) {
    if (!unlockedMods[vehicleType]) {
      unlockedMods[vehicleType] = [];
    }
    unlockedMods[vehicleType].push(modId);
    saveUnlockedMods(unlockedMods);
  }
}

// Get all unlocked mods for a vehicle
function getVehicleMods(vehicleType) {
  return unlockedMods[vehicleType] || [];
}

// Check if current vehicle has a specific mod effect
function hasModEffect(effectName) {
  const vehicleMods = VEHICLE_MODS[selectedVehicle] || [];
  const unlockedModIds = getVehicleMods(selectedVehicle);

  return vehicleMods.some(
    (mod) => unlockedModIds.includes(mod.id) && mod.effect === effectName
  );
}

// Get mod effect value (for multipliers, etc.)
function getModEffectValue(effectName, defaultValue = 1) {
  if (!hasModEffect(effectName)) return defaultValue;

  // Define effect multipliers
  const effectValues = {
    coinValue2x: 2,
    scoreMultiplier1_5x: 1.5,
    boostSpeed25: 1.5,
    heartSpawnBoost: 1.5,
  };

  return effectValues[effectName] || defaultValue;
}

// Game state
let selectedVehicle = "motorcycle"; // Default vehicle selection
let totalCoins = loadTotalCoins(); // Persistent coin counter
let unlockedVehicles = loadUnlockedVehicles(); // Persistent unlocked vehicles
let unlockedMods = loadUnlockedMods(); // Persistent unlocked mods per vehicle

let game = {
  health: 3,
  score: 0,
  highScore: loadHighScore(),
  isRunning: false, // Start as false, will be true when game starts from menu
  isPaused: false,
  scrollOffset: 0,
  motorcycle: {
    lane: 1, // 0, 1, or 2 (left, center, right) - starts in center
    row: 15, // Position from bottom (fixed)
  },
  obstacles: [],
  powerups: [],
  hasShield: false,
  keys: {},
  currentSpeed: DEFAULT_SCROLL_SPEED,
  currentSpawnChance: DEFAULT_OBSTACLE_SPAWN_CHANCE,
  isMuted: false,
  isBoosting: false,
  lanes: INITIAL_LANES, // Current number of lanes
  laneWidth: canvas.width / INITIAL_LANES, // Dynamic lane width
  vehicleType: "motorcycle", // Current vehicle
  milestonesReached: {}, // Track which milestone sounds have been played
  // Achievement tracking
  damageTaken: false, // Track if player has taken damage this game
  coinsThisGame: 0, // Track coins collected this game
  consecutiveBombDeaths: 0, // Track consecutive deaths from bombs
  lastDeathWasBomb: false, // Track if last death was from bomb
};

// Load achievements from localStorage on game start
loadAchievements();

// ==================== DEBUG MODE FUNCTIONS ====================

// Show debug status message
function showDebugStatus(message, duration = 3000) {
  debugStatus.textContent = message;
  debugStatus.classList.add("show");
  setTimeout(() => {
    debugStatus.classList.remove("show");
  }, duration);
}

// Debug: Apply custom starting health
debugApplyHealthBtn.addEventListener("click", () => {
  const healthValue = parseInt(debugHealthInput.value);
  if (healthValue > 0 && healthValue <= 100) {
    debugMode.customStartHealth = healthValue;
    showDebugStatus(`✓ Starting health set to ${healthValue}`);
  } else {
    showDebugStatus("✗ Health must be 1-100", 2000);
  }
});

// Debug: Toggle invincibility
debugInvincibilityCheckbox.addEventListener("change", (e) => {
  debugMode.invincibility = e.target.checked;
  if (debugMode.invincibility) {
    showDebugStatus("✓ Invincibility enabled");
  } else {
    showDebugStatus("✓ Invincibility disabled");
  }
});

// Debug: Give coins
debugAddCoinsBtn.addEventListener("click", () => {
  const coinsToAdd = parseInt(debugCoinsInput.value);
  if (coinsToAdd > 0) {
    totalCoins += coinsToAdd;
    saveTotalCoins(totalCoins);
    updateCoinsDisplay();
    showDebugStatus(`✓ Added ${coinsToAdd} coins`);
  } else {
    showDebugStatus("✗ Coin amount must be > 0", 2000);
  }
});

// Debug: Reset coins to 0
debugResetCoinsBtn.addEventListener("click", () => {
  totalCoins = 0;
  saveTotalCoins(totalCoins);
  updateCoinsDisplay();
  showDebugStatus("✓ Coins reset to 0");
});

// Debug: Lock all vehicles and reset mods
debugResetVehiclesBtn.addEventListener("click", () => {
  // Lock all vehicles except motorcycle
  localStorage.setItem(
    "motorcycleUnlockedVehicles",
    JSON.stringify(["motorcycle"])
  );

  // Reset all vehicle mods to locked
  localStorage.setItem(
    "motorcycleUnlockedMods",
    JSON.stringify({
      motorcycle: [],
      car: [],
      truck: [],
    })
  );

  showDebugStatus("✓ Vehicles locked & mods reset - Reloading...", 1500);

  // Reload the page after a short delay so user sees the message
  setTimeout(() => {
    location.reload();
  }, 1500);
});

// Debug: Reset all achievements
debugResetAchievementsBtn.addEventListener("click", () => {
  // Reset all achievements to unlocked: false
  Object.keys(ACHIEVEMENTS).forEach((key) => {
    ACHIEVEMENTS[key].unlocked = false;
  });
  saveAchievements();
  showDebugStatus("✓ All achievements reset");
});

// ==================== END DEBUG MODE FUNCTIONS ====================

// Audio control
bgMusic.volume = 0.5; // Set volume to 50%

// Pause button - show pause menu
pauseBtn.addEventListener("click", () => {
  if (!game.isRunning) return;
  game.isPaused = true;
  bgMusic.pause();
  pauseMenu.classList.remove("hidden");
  // Play pause menu sound
  if (!game.isMuted) {
    pauseMenuSound.currentTime = 0;
    pauseMenuSound
      .play()
      .catch((e) => console.log("Pause menu sound error:", e));
  }
});

// Mute/unmute button
muteBtn.addEventListener("click", () => {
  game.isMuted = !game.isMuted;
  if (game.isMuted) {
    bgMusic.pause();
    muteBtn.textContent = "🔇";
  } else {
    if (!game.isPaused) {
      bgMusic.play();
    }
    muteBtn.textContent = "🔊";
  }
});

// Get current difficulty settings based on score
function getCurrentDifficulty() {
  const thresholds = Object.keys(DIFFICULTY_CONFIG)
    .map(Number)
    .sort((a, b) => b - a); // Sort descending

  for (const threshold of thresholds) {
    if (game.score >= threshold) {
      return DIFFICULTY_CONFIG[threshold];
    }
  }

  return DIFFICULTY_CONFIG[0];
}

// Update difficulty based on current score
function updateDifficulty() {
  const difficulty = getCurrentDifficulty();
  game.currentSpeed = difficulty.speed;
  game.currentSpawnChance = difficulty.spawnChance;
}

// Check and play milestone sounds
function checkMilestones() {
  // Check for 1000 score milestone - "nioce"
  if (game.score >= 1000 && !game.milestonesReached[1000]) {
    game.milestonesReached[1000] = true;
    if (!game.isMuted) {
      milestone1000Sound.currentTime = 0;
      milestone1000Sound
        .play()
        .catch((e) => console.log("Milestone sound error:", e));
    }
  }

  // Check for 2000 score milestone - "messi"
  if (game.score >= 2000 && !game.milestonesReached[2000]) {
    game.milestonesReached[2000] = true;
    if (!game.isMuted) {
      milestone2000Sound.currentTime = 0;
      milestone2000Sound
        .play()
        .catch((e) => console.log("Milestone sound error:", e));
    }
  }

  // Check for 3000 score milestone - "cheering"
  if (game.score >= 3000 && !game.milestonesReached[3000]) {
    game.milestonesReached[3000] = true;
    if (!game.isMuted) {
      milestone3000Sound.currentTime = 0;
      milestone3000Sound
        .play()
        .catch((e) => console.log("Milestone sound error:", e));
    }
  }
}

// Check and update lane expansion based on score
function updateLaneExpansion() {
  if (game.score >= LANE_EXPANSION_THRESHOLD && game.lanes === INITIAL_LANES) {
    game.lanes = EXPANDED_LANES;

    // Expand canvas width dynamically
    const oldCanvasWidth = canvas.width;
    const newCanvasWidth = Math.floor(
      oldCanvasWidth * (EXPANDED_LANES / INITIAL_LANES)
    );
    canvas.width = newCanvasWidth;

    game.laneWidth = canvas.width / EXPANDED_LANES;

    // Adjust motorcycle position to keep it in the same physical lane
    // Lanes are added on the outside, so old lanes 0,1,2 become 1,2,3
    game.motorcycle.lane = game.motorcycle.lane + 1;
  }
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  // Track keys for debug mode (A+W+D)
  const key = e.key.toLowerCase();
  debugMode.keysPressed.add(key);

  // Check if A+W+D are all pressed
  if (
    debugMode.keysPressed.has("a") &&
    debugMode.keysPressed.has("w") &&
    debugMode.keysPressed.has("d")
  ) {
    if (!debugMode.active) {
      debugMode.active = true;
      debugOverlay.classList.remove("hidden");
    }
  }

  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    moveLane(-1);
  } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    moveLane(1);
  } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
    game.isBoosting = true;
  }
});

document.addEventListener("keyup", (e) => {
  // Track key release for debug mode
  const key = e.key.toLowerCase();
  debugMode.keysPressed.delete(key);

  // Hide debug overlay if any of A, W, or D is released
  if (debugMode.active && (key === "a" || key === "w" || key === "d")) {
    debugMode.active = false;
    debugOverlay.classList.add("hidden");
  }

  if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
    game.isBoosting = false;
  }
});

function moveLane(direction) {
  if (!game.isRunning) return;

  const newLane = game.motorcycle.lane + direction;
  if (newLane >= 0 && newLane < game.lanes) {
    game.motorcycle.lane = newLane;
  }
}

// Show banana roast when player takes damage
function showBananaRoast() {
  // Clear any existing timeout
  if (roastTimeout) {
    clearTimeout(roastTimeout);
  }

  // Pick a random roast
  const randomRoast =
    BANANA_ROASTS[Math.floor(Math.random() * BANANA_ROASTS.length)];
  roastText.textContent = randomRoast;

  // Show the speech bubble
  bananaSpeechBubble.classList.remove("hidden");

  // Hide after 2.5 seconds
  roastTimeout = setTimeout(() => {
    bananaSpeechBubble.classList.add("hidden");
  }, 2500);
}

// Show golden sparkle animation when survival chance mod triggers
function showGoldenSparkle() {
  const gameContainer = document.querySelector(".game-container");

  // Calculate motorcycle position on screen
  const x = game.motorcycle.lane * game.laneWidth + game.laneWidth / 2;
  const y = game.motorcycle.row * TILE_HEIGHT + TILE_HEIGHT / 2;

  // Create sparkle container
  const sparkleContainer = document.createElement("div");
  sparkleContainer.className = "golden-sparkle";
  sparkleContainer.style.left = `${x}px`;
  sparkleContainer.style.top = `${y + 20}px`; // Offset by game-info height
  sparkleContainer.style.fontSize = "48px";
  sparkleContainer.textContent = "✨";

  // Create multiple sparkle particles
  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "sparkle-particle";

    // Random direction for each particle
    const angle = (Math.PI * 2 * i) / particleCount;
    const distance = 80 + Math.random() * 40;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    particle.style.setProperty("--tx", `${tx}px`);
    particle.style.setProperty("--ty", `${ty}px`);

    sparkleContainer.appendChild(particle);
  }

  gameContainer.appendChild(sparkleContainer);

  // Remove after animation completes
  setTimeout(() => {
    sparkleContainer.remove();
  }, 1000);
}

// Show achievement notification
function showAchievementNotification(achievement) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "achievement-notification";
  notification.innerHTML = `
    <div class="achievement-icon">🏆</div>
    <div class="achievement-content">
      <h3 class="achievement-title">${achievement.name}</h3>
      <p class="achievement-description">${achievement.description}</p>
    </div>
  `;

  // Add to container
  achievementContainer.appendChild(notification);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    notification.classList.add("slide-out");
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 4000);
}

// Initialize obstacles
function spawnObstacle() {
  if (Math.random() < game.currentSpawnChance) {
    // Check which lanes are safe to spawn in
    const safeLanes = getSafeLanes();

    // If all lanes are blocked nearby, skip spawning
    if (safeLanes.length === 0) {
      return;
    }

    // Choose a random lane from safe lanes
    const lane = safeLanes[Math.floor(Math.random() * safeLanes.length)];
    game.obstacles.push({
      lane: lane,
      y: -TILE_HEIGHT,
    });
  }
}

// Spawn shield powerup
function spawnShieldPowerup() {
  if (Math.random() < SHIELD_SPAWN_CHANCE) {
    const lane = Math.floor(Math.random() * game.lanes);
    game.powerups.push({
      type: "shield",
      lane: lane,
      y: -TILE_HEIGHT,
    });
  }
}

// Spawn bomb
function spawnBomb() {
  if (Math.random() < BOMB_SPAWN_CHANCE) {
    const lane = Math.floor(Math.random() * game.lanes);
    game.powerups.push({
      type: "bomb",
      lane: lane,
      y: -TILE_HEIGHT,
    });
  }
}

// Spawn heart powerup
function spawnHeart() {
  // Apply heart spawn boost mod
  const heartSpawnChance =
    HEART_SPAWN_CHANCE * getModEffectValue("heartSpawnBoost", 1);

  if (Math.random() < heartSpawnChance) {
    const lane = Math.floor(Math.random() * game.lanes);
    game.powerups.push({
      type: "heart",
      lane: lane,
      y: -TILE_HEIGHT,
    });
  }
}

// Spawn coin collectible
function spawnCoin() {
  if (Math.random() < COIN_SPAWN_CHANCE) {
    const lane = Math.floor(Math.random() * game.lanes);
    game.powerups.push({
      type: "coin",
      lane: lane,
      y: -TILE_HEIGHT,
    });
  }
}

// Get lanes that are safe to spawn obstacles in (prevents undodgeable walls)
function getSafeLanes() {
  // Check if ANY obstacle exists in the danger zone at the top
  // This prevents both same-lane stacking AND staggered walls across lanes
  const DANGER_ZONE_HEIGHT = TILE_HEIGHT * 1; // 150px buffer - tight but fair

  const hasObstacleInDangerZone = game.obstacles.some((obstacle) => {
    return obstacle.y >= -TILE_HEIGHT && obstacle.y <= DANGER_ZONE_HEIGHT;
  });

  // If ANY obstacle is in the danger zone, don't spawn anything
  // This ensures minimum vertical spacing between all obstacles
  if (hasObstacleInDangerZone) {
    return [];
  }

  // All lanes are safe - return all lanes
  return Array.from({ length: game.lanes }, (_, i) => i);
}

// Update game state
function update() {
  if (!game.isRunning || game.isPaused) return;

  // Update difficulty based on score
  updateDifficulty();

  // Check milestone achievements
  checkMilestones();

  // Update lane expansion based on score
  updateLaneExpansion();

  // Calculate actual speed (double if boosting, with boost mod multiplier)
  const boostMultiplier = game.isBoosting
    ? 2 * getModEffectValue("boostSpeed25", 1)
    : 1;
  const actualSpeed = game.currentSpeed * boostMultiplier;

  // Update scroll offset
  game.scrollOffset += actualSpeed;

  // Spawn obstacles and powerups
  spawnObstacle();
  spawnShieldPowerup();
  spawnBomb();
  spawnHeart();
  spawnCoin();

  // Update obstacles
  game.obstacles.forEach((obstacle) => {
    obstacle.y += actualSpeed;
  });

  // Update powerups
  game.powerups.forEach((powerup) => {
    powerup.y += actualSpeed;
  });

  // Check powerup collection
  const motorcycleY = game.motorcycle.row * TILE_HEIGHT;
  game.powerups = game.powerups.filter((powerup) => {
    // Check if powerup is collected
    if (
      powerup.lane === game.motorcycle.lane &&
      powerup.y >= motorcycleY - TILE_HEIGHT &&
      powerup.y <= motorcycleY + TILE_HEIGHT
    ) {
      if (powerup.type === "shield") {
        game.hasShield = true;
        // Set shield hits based on mods
        game.shieldHits = hasModEffect("shieldDoubleHit") ? 2 : 1;
        // Play bubble sound
        if (!game.isMuted) {
          bubbleSound.currentTime = 0;
          bubbleSound
            .play()
            .catch((e) => console.log("Bubble sound error:", e));
        }
      } else if (powerup.type === "bomb") {
        // Debug invincibility mode - ignore bomb damage
        if (debugMode.invincibility) {
          // Remove bomb but don't take damage
          return false;
        }

        // Check survival chance before fatal bomb damage
        let survived = false;

        // Check survival chance mods (bomb is always fatal)
        if (hasModEffect("survivalChance35")) {
          if (Math.random() < 0.35) {
            survived = true;
          }
        } else if (hasModEffect("survivalChance20")) {
          if (Math.random() < 0.2) {
            survived = true;
          }
        }

        if (survived) {
          // Survived the bomb! Play Heroes Never Die sound and show golden sparkle
          showGoldenSparkle();
          if (!game.isMuted) {
            heroesNeverDieSound.currentTime = 0;
            heroesNeverDieSound
              .play()
              .catch((e) => console.log("Survival sound error:", e));
          }
        } else {
          // Fatal bomb damage
          game.health = 0;
          healthDisplay.textContent = game.health;

          // Mark that this death was from a bomb (for achievement tracking)
          game.lastDeathWasBomb = true;

          // Show banana roast
          showBananaRoast();

          // Play explosion sound
          if (!game.isMuted) {
            explosionSound.currentTime = 0;
            explosionSound
              .play()
              .catch((e) => console.log("Explosion sound error:", e));
          }
          gameOver();
        }
      } else if (powerup.type === "heart") {
        // Add 1 health point
        game.health++;
        healthDisplay.textContent = game.health;

        // Check Loves Cardio achievement: Hit a balance of 10 hearts in any game
        if (game.health >= 10 && !isAchievementUnlocked("lovesCardio")) {
          unlockAchievement("lovesCardio");
        }

        // Play heart pickup sound
        if (!game.isMuted) {
          heartPickupSound.currentTime = 0;
          heartPickupSound
            .play()
            .catch((e) => console.log("Heart pickup sound error:", e));
        }
      } else if (powerup.type === "coin") {
        // Collect coin and add to total (with coin value multiplier)
        const coinValue = Math.floor(getModEffectValue("coinValue2x", 1));
        totalCoins += coinValue;
        saveTotalCoins(totalCoins);

        // Track coins collected this game for achievements
        game.coinsThisGame += coinValue;
        updateCoinsDisplay();
        // Play coin sound
        if (!game.isMuted) {
          coinSound.currentTime = 0;
          coinSound.play().catch((e) => console.log("Coin sound error:", e));
        }
      }
      return false; // Remove powerup after collection
    }

    // Remove powerups that are off screen
    if (powerup.y > canvas.height) {
      return false;
    }

    return true;
  });

  // Check collisions
  game.obstacles = game.obstacles.filter((obstacle) => {
    // Check if obstacle is at motorcycle position
    if (
      obstacle.lane === game.motorcycle.lane &&
      obstacle.y >= motorcycleY - TILE_HEIGHT &&
      obstacle.y <= motorcycleY + TILE_HEIGHT
    ) {
      // Debug invincibility mode - ignore all obstacle damage
      if (debugMode.invincibility) {
        return false; // Remove obstacle but take no damage
      }

      // Shield absorbs the hit
      if (game.hasShield) {
        game.shieldHits--;
        if (game.shieldHits <= 0) {
          game.hasShield = false;
        }
        // Play hitmarker sound when shield absorbs hit
        if (!game.isMuted) {
          hitmarkerSound.currentTime = 0;
          hitmarkerSound
            .play()
            .catch((e) => console.log("Hitmarker sound error:", e));
        }
        return false; // Remove obstacle
      }

      // No shield, check for survival chance mods
      let survived = false;

      // Check if this would be fatal
      if (game.health - 1 <= 0) {
        // Check survival chance mods
        if (hasModEffect("survivalChance35")) {
          if (Math.random() < 0.35) {
            survived = true;
          }
        } else if (hasModEffect("survivalChance20")) {
          if (Math.random() < 0.2) {
            survived = true;
          }
        }
      }

      if (survived) {
        // Survived the critical hit, don't take damage
        // Play Heroes Never Die sound and show golden sparkle as feedback
        showGoldenSparkle();
        if (!game.isMuted) {
          heroesNeverDieSound.currentTime = 0;
          heroesNeverDieSound
            .play()
            .catch((e) => console.log("Survival sound error:", e));
        }
      } else {
        // Take damage
        game.health--;
        healthDisplay.textContent = game.health;

        // Mark that damage was taken (for no-damage achievements)
        game.damageTaken = true;

        // This death was NOT from a bomb (reset bomb death streak)
        game.lastDeathWasBomb = false;

        // Show banana roast
        showBananaRoast();

        // Play hitmarker sound on damage
        if (!game.isMuted) {
          hitmarkerSound.currentTime = 0;
          hitmarkerSound
            .play()
            .catch((e) => console.log("Hitmarker sound error:", e));
        }

        if (game.health <= 0) {
          gameOver();
        }
      }
      return false; // Remove obstacle after collision
    }

    // Remove obstacles that are off screen
    if (obstacle.y > canvas.height) {
      // Apply score multiplier mod
      const scoreValue = Math.floor(
        10 * getModEffectValue("scoreMultiplier1_5x", 1)
      );
      game.score += scoreValue;
      scoreDisplay.textContent = game.score;

      // Update high score if current score exceeds it
      if (game.score > game.highScore) {
        game.highScore = game.score;
        saveHighScore(game.highScore);
      }

      // Check score-based achievements during gameplay
      if (!game.damageTaken) {
        // Kinda Crazy: Reach 500 score without taking damage
        if (game.score >= 500 && !isAchievementUnlocked("kindaCrazy")) {
          unlockAchievement("kindaCrazy");
        }

        // Touch Grass: Reach 1000 score without taking damage
        if (game.score >= 1000 && !isAchievementUnlocked("touchGrass")) {
          unlockAchievement("touchGrass");
        }
      }

      // No Life: Reach 10000 score (no damage requirement)
      if (game.score >= 10000 && !isAchievementUnlocked("noLife")) {
        unlockAchievement("noLife");
      }

      return false;
    }

    return true;
  });
}

// Render game
function render() {
  // Clear canvas
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw road tiles
  drawRoad();

  // Draw lane dividers
  drawLaneDividers();

  // Draw obstacles
  game.obstacles.forEach((obstacle) => {
    drawObstacle(obstacle);
  });

  // Draw powerups
  game.powerups.forEach((powerup) => {
    drawPowerup(powerup);
  });

  // Draw motorcycle
  drawMotorcycle();

  // Draw shield if active
  if (game.hasShield) {
    drawShield();
  }

  // Draw high score in top left corner
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`High Score: ${game.highScore}`, 10, 25);
}

function drawRoad() {
  // Draw alternating road tiles
  const offset = game.scrollOffset % TILE_HEIGHT;

  for (let row = 0; row <= TOTAL_TILES; row++) {
    const y = row * TILE_HEIGHT - offset;

    // Alternate colors for visual effect
    if (Math.floor(row + game.scrollOffset / TILE_HEIGHT) % 2 === 0) {
      ctx.fillStyle = "#2c3e50";
    } else {
      ctx.fillStyle = "#34495e";
    }

    ctx.fillRect(0, y, canvas.width, TILE_HEIGHT);
  }
}

function drawLaneDividers() {
  ctx.strokeStyle = "#f1c40f";
  ctx.lineWidth = 3;
  ctx.setLineDash([20, 10]);

  const offset = game.scrollOffset % 30;

  for (let i = 1; i < game.lanes; i++) {
    const x = i * game.laneWidth;
    ctx.beginPath();
    ctx.moveTo(x, -offset);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

function drawObstacle(obstacle) {
  const x = obstacle.lane * game.laneWidth + game.laneWidth / 2;
  const y = obstacle.y + TILE_HEIGHT / 2;

  // Draw obstacle as a crate/barrel
  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(
    x - game.laneWidth * 0.3,
    y - TILE_HEIGHT * 0.3,
    game.laneWidth * 0.6,
    TILE_HEIGHT * 0.6
  );

  // Add border
  ctx.strokeStyle = "#c0392b";
  ctx.lineWidth = 3;
  ctx.strokeRect(
    x - game.laneWidth * 0.3,
    y - TILE_HEIGHT * 0.3,
    game.laneWidth * 0.6,
    TILE_HEIGHT * 0.6
  );
}

function drawMotorcycle() {
  const x = game.motorcycle.lane * game.laneWidth + game.laneWidth / 2;
  const y = game.motorcycle.row * TILE_HEIGHT + TILE_HEIGHT / 2;

  // Draw the selected vehicle
  const vehicle = VEHICLES[game.vehicleType];
  if (vehicle) {
    vehicle.draw(ctx, x, y);
  }
}

function drawPowerup(powerup) {
  const x = powerup.lane * game.laneWidth + game.laneWidth / 2;
  const y = powerup.y + TILE_HEIGHT / 2;

  if (powerup.type === "shield") {
    // Draw light blue bubble shield powerup
    ctx.fillStyle = "rgba(173, 216, 230, 0.6)"; // Light blue with transparency
    ctx.beginPath();
    ctx.arc(x, y, TILE_HEIGHT * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Add border
    ctx.strokeStyle = "#87CEEB"; // Sky blue
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, TILE_HEIGHT * 0.4, 0, Math.PI * 2);
    ctx.stroke();

    // Add shine effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, TILE_HEIGHT * 0.15, 0, Math.PI * 2);
    ctx.fill();
  } else if (powerup.type === "bomb") {
    // Draw black cannonball bomb
    ctx.fillStyle = "#1a1a1a"; // Black
    ctx.beginPath();
    ctx.arc(x, y, TILE_HEIGHT * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Add shadow/3D effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, TILE_HEIGHT * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Draw fuse
    ctx.strokeStyle = "#8B4513"; // Brown fuse
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x + 8, y - TILE_HEIGHT * 0.25);
    ctx.lineTo(x + 15, y - TILE_HEIGHT * 0.4);
    ctx.stroke();

    // Draw spark at end of fuse
    ctx.fillStyle = "#FF4500"; // Orange-red
    ctx.beginPath();
    ctx.arc(x + 15, y - TILE_HEIGHT * 0.4, 3, 0, Math.PI * 2);
    ctx.fill();

    // Add flicker effect
    ctx.fillStyle = "#FFD700"; // Gold
    ctx.beginPath();
    ctx.arc(x + 16, y - TILE_HEIGHT * 0.42, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (powerup.type === "heart") {
    // Draw red heart
    ctx.fillStyle = "#FF0000"; // Red
    ctx.beginPath();

    // Draw heart using bezier curves
    const heartSize = TILE_HEIGHT * 0.3;
    ctx.moveTo(x, y + heartSize * 0.3);

    // Left side of heart
    ctx.bezierCurveTo(
      x,
      y,
      x - heartSize * 0.5,
      y - heartSize * 0.5,
      x - heartSize,
      y
    );
    ctx.bezierCurveTo(
      x - heartSize,
      y + heartSize * 0.3,
      x - heartSize * 0.5,
      y + heartSize * 0.7,
      x,
      y + heartSize
    );

    // Right side of heart
    ctx.bezierCurveTo(
      x + heartSize * 0.5,
      y + heartSize * 0.7,
      x + heartSize,
      y + heartSize * 0.3,
      x + heartSize,
      y
    );
    ctx.bezierCurveTo(
      x + heartSize * 0.5,
      y - heartSize * 0.5,
      x,
      y,
      x,
      y + heartSize * 0.3
    );

    ctx.fill();

    // Add shine effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(
      x - heartSize * 0.3,
      y - heartSize * 0.1,
      heartSize * 0.2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  } else if (powerup.type === "coin") {
    // Draw gold coin
    ctx.fillStyle = "#FFD700"; // Gold
    ctx.strokeStyle = "#DAA520"; // Darker gold for border
    ctx.lineWidth = 3;

    // Draw coin circle
    ctx.beginPath();
    ctx.arc(x, y, TILE_HEIGHT * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Add inner circle detail
    ctx.strokeStyle = "#DAA520";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, TILE_HEIGHT * 0.25, 0, Math.PI * 2);
    ctx.stroke();

    // Add $ symbol in center
    ctx.fillStyle = "#8B6914"; // Dark gold for symbol
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$", x, y);

    // Add shine effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawShield() {
  const x = game.motorcycle.lane * game.laneWidth + game.laneWidth / 2;
  const y = game.motorcycle.row * TILE_HEIGHT + TILE_HEIGHT / 2;

  // Draw bubble shield around motorcycle
  ctx.strokeStyle = "#87CEEB"; // Sky blue
  ctx.lineWidth = 4;
  ctx.fillStyle = "rgba(173, 216, 230, 0.3)"; // Light blue with transparency

  ctx.beginPath();
  ctx.arc(x, y, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Add shimmer effect
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x - 10, y - 10, 15, 0, Math.PI * 2);
  ctx.stroke();
}

// Update coins display
function updateCoinsDisplay() {
  coinsDisplay.textContent = totalCoins;
  menuCoinsDisplay.textContent = totalCoins;
  modCoinsDisplay.textContent = totalCoins;
}

function gameOver() {
  game.isRunning = false;
  finalScoreDisplay.textContent = game.score;
  gameOverScreen.classList.remove("hidden");
  bgMusic.pause();

  // Check achievements on game over
  checkGameOverAchievements();

  // Play random game over sound effect
  if (!game.isMuted) {
    const randomSound =
      gameOverSounds[Math.floor(Math.random() * gameOverSounds.length)];
    randomSound.currentTime = 0;
    randomSound.play().catch((e) => console.log("Game over sound error:", e));
  }
}

// Check achievements when game ends
function checkGameOverAchievements() {
  // Idiot: Die without scoring any points
  if (game.score === 0 && !isAchievementUnlocked("idiot")) {
    unlockAchievement("idiot");
  }

  // Demolitionist: Die 3 times in a row due to a bomb
  if (game.lastDeathWasBomb) {
    game.consecutiveBombDeaths++;
    if (
      game.consecutiveBombDeaths >= 3 &&
      !isAchievementUnlocked("demolitionist")
    ) {
      unlockAchievement("demolitionist");
    }
  } else {
    game.consecutiveBombDeaths = 0;
  }

  // Note: Score-based achievements ("Kinda Crazy", "Touch Grass", "No Life")
  // are now checked during gameplay in the update() function when score increases,
  // not here on game over. This allows them to trigger immediately during gameplay.

  // Uncle Scrooge: Collect 25 coins in one game
  if (game.coinsThisGame >= 25 && !isAchievementUnlocked("uncleScrooge")) {
    unlockAchievement("uncleScrooge");
  }
}

function restart() {
  const wasMuted = game.isMuted;
  const currentHighScore = game.highScore;
  const currentVehicle = game.vehicleType;

  // Reset canvas to initial width
  canvas.width = 800;

  // Calculate initial health based on mods or debug mode
  let initialHealth = 3;
  if (debugMode.customStartHealth !== null) {
    // Debug mode override
    initialHealth = debugMode.customStartHealth;
  } else if (hasModEffect("maxHealth5")) {
    initialHealth = 5;
  }

  // Check if should start with shield
  const startWithShield = hasModEffect("startWithShield");

  // Calculate shield hit count based on mods
  let shieldHits = 1;
  if (hasModEffect("shieldDoubleHit")) {
    shieldHits = 2;
  }

  game = {
    health: initialHealth,
    score: 0,
    highScore: currentHighScore,
    isRunning: true,
    isPaused: false,
    scrollOffset: 0,
    motorcycle: {
      lane: 1,
      row: 15,
    },
    obstacles: [],
    powerups: [],
    hasShield: startWithShield,
    shieldHits: startWithShield ? shieldHits : 0,
    keys: {},
    currentSpeed: DEFAULT_SCROLL_SPEED,
    currentSpawnChance: DEFAULT_OBSTACLE_SPAWN_CHANCE,
    isMuted: wasMuted,
    isBoosting: false,
    lanes: INITIAL_LANES,
    laneWidth: canvas.width / INITIAL_LANES,
    vehicleType: currentVehicle,
    milestonesReached: {},
    // Reset achievement tracking for new game
    damageTaken: false,
    coinsThisGame: 0,
    consecutiveBombDeaths: game.consecutiveBombDeaths || 0, // Preserve bomb death streak
    lastDeathWasBomb: false,
  };

  healthDisplay.textContent = game.health;
  scoreDisplay.textContent = game.score;
  gameOverScreen.classList.add("hidden");
  pauseBtn.textContent = "⏸️";

  // Resume music if not muted
  if (!game.isMuted) {
    bgMusic.currentTime = 0;
    bgMusic.play();
  }
}

restartBtn.addEventListener("click", restart);

// Menu functionality
function showMenu() {
  menuScreen.classList.remove("hidden");
  pauseMenu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  game.isRunning = false;
  game.isPaused = false;
  bgMusic.pause();
  bgMusic.currentTime = 0;

  // Show legend when returning to menu
  const gameLegend = document.querySelector(".game-legend");
  if (gameLegend) {
    gameLegend.classList.remove("hidden");
  }
}

function startGame() {
  menuScreen.classList.add("hidden");

  // Hide legend when game starts
  const gameLegend = document.querySelector(".game-legend");
  if (gameLegend) {
    gameLegend.classList.add("hidden");
  }

  const wasMuted = game.isMuted;
  const currentHighScore = game.highScore;

  // Reset canvas to initial width
  canvas.width = 800;

  // Calculate initial health based on mods or debug mode
  let initialHealth = 3;
  if (debugMode.customStartHealth !== null) {
    // Debug mode override
    initialHealth = debugMode.customStartHealth;
  } else if (hasModEffect("maxHealth5")) {
    initialHealth = 5;
  }

  // Check if should start with shield
  const startWithShield = hasModEffect("startWithShield");

  // Calculate shield hit count based on mods
  let shieldHits = 1;
  if (hasModEffect("shieldDoubleHit")) {
    shieldHits = 2;
  }

  game = {
    health: initialHealth,
    score: 0,
    highScore: currentHighScore,
    isRunning: true,
    isPaused: false,
    scrollOffset: 0,
    motorcycle: {
      lane: 1,
      row: 15,
    },
    obstacles: [],
    powerups: [],
    hasShield: startWithShield,
    shieldHits: startWithShield ? shieldHits : 0,
    keys: {},
    currentSpeed: DEFAULT_SCROLL_SPEED,
    currentSpawnChance: DEFAULT_OBSTACLE_SPAWN_CHANCE,
    isMuted: wasMuted,
    isBoosting: false,
    lanes: INITIAL_LANES,
    laneWidth: canvas.width / INITIAL_LANES,
    vehicleType: selectedVehicle,
    milestonesReached: {},
  };

  healthDisplay.textContent = game.health;
  scoreDisplay.textContent = game.score;

  // Start music if not muted
  if (!game.isMuted) {
    bgMusic.currentTime = 0;
    bgMusic.play();
  }
}

// Update vehicle UI based on unlock state
function updateVehicleUI() {
  vehicleOptions.forEach((option) => {
    const vehicleType = option.dataset.vehicle;
    const unlocked = isVehicleUnlocked(vehicleType);
    const lockOverlay = option.querySelector(".lock-overlay");
    const unlockBtn = option.querySelector(".vehicle-unlock-btn");
    const modifyBtn = option.querySelector(".vehicle-modify-btn");
    const previewContainer = option.querySelector(".vehicle-preview-container");

    if (unlocked) {
      // Vehicle is unlocked
      if (lockOverlay) {
        lockOverlay.style.display = "none";
      }
      if (unlockBtn) {
        unlockBtn.style.display = "none";
      }
      if (modifyBtn) {
        modifyBtn.style.display = "flex";
      }
      if (previewContainer) previewContainer.classList.remove("locked");
      option.style.pointerEvents = "auto";
      option.style.opacity = "1";
    } else {
      // Vehicle is locked
      if (lockOverlay) {
        lockOverlay.style.display = "flex";
      }
      if (unlockBtn) {
        unlockBtn.style.display = "flex";
      }
      if (modifyBtn) {
        modifyBtn.style.display = "none";
      }
      if (previewContainer) previewContainer.classList.add("locked");
      option.style.opacity = "0.6";

      // Update unlock button disabled state based on coins
      const price = VEHICLE_PRICES[vehicleType];
      if (unlockBtn) {
        if (totalCoins >= price) {
          unlockBtn.disabled = false;
        } else {
          unlockBtn.disabled = true;
        }
      }
    }
  });

  // Update coin display on menu
  updateCoinsDisplay();
}

// Update mod UI based on unlock state
function updateModUI() {
  const modBoxes = document.querySelectorAll(".mod-box");
  const mods = VEHICLE_MODS[currentModVehicle] || [];

  modBoxes.forEach((box, index) => {
    if (index >= mods.length) return;

    const mod = mods[index];
    const modId = mod.id;
    const unlocked = isModUnlocked(currentModVehicle, modId);
    const lockOverlay = box.querySelector(".lock-overlay");
    const unlockBtn = box.querySelector(".mod-unlock-btn");
    const previewContainer = box.querySelector(".mod-preview-container");
    const modName = box.querySelector(".mod-name");
    const modDescription = box.querySelector(".mod-description");
    const unlockPrice = box.querySelector(".unlock-price");

    // Update mod name and description
    if (modName) modName.textContent = mod.name;
    if (modDescription) modDescription.textContent = mod.description;
    if (unlockPrice) unlockPrice.textContent = mod.price;

    // Set data attribute for mod ID
    box.dataset.mod = modId;

    if (unlocked) {
      // Mod is unlocked
      if (lockOverlay) {
        lockOverlay.style.display = "none";
      }
      if (previewContainer) {
        previewContainer.classList.remove("locked");
      }
      if (unlockBtn) {
        // Restore button structure if needed
        const coinIcon = unlockBtn.querySelector(".coin-icon");
        const priceSpan = unlockBtn.querySelector(".unlock-price");
        if (!coinIcon || !priceSpan) {
          unlockBtn.innerHTML = `
            <span class="coin-icon">💰</span>
            <span class="unlock-price">${mod.price}</span>
          `;
        }
        // Hide the price elements and show UNLOCKED text
        if (coinIcon) coinIcon.style.display = "none";
        if (priceSpan) {
          priceSpan.textContent = "UNLOCKED";
          priceSpan.style.fontSize = "16px";
        }
        unlockBtn.classList.add("unlocked");
        unlockBtn.disabled = true;
      }
    } else {
      // Mod is locked
      if (lockOverlay) {
        lockOverlay.style.display = "flex";
      }
      if (previewContainer) {
        previewContainer.classList.add("locked");
      }
      if (unlockBtn) {
        // Restore button structure if needed
        const coinIcon = unlockBtn.querySelector(".coin-icon");
        const priceSpan = unlockBtn.querySelector(".unlock-price");
        if (!coinIcon || !priceSpan) {
          unlockBtn.innerHTML = `
            <span class="coin-icon">💰</span>
            <span class="unlock-price">${mod.price}</span>
          `;
        } else {
          // Show price elements
          if (coinIcon) coinIcon.style.display = "inline";
          if (priceSpan) {
            priceSpan.textContent = mod.price;
            priceSpan.style.fontSize = "18px";
          }
        }
        unlockBtn.classList.remove("unlocked");
        // Update button disabled state based on coins
        if (totalCoins >= mod.price) {
          unlockBtn.disabled = false;
        } else {
          unlockBtn.disabled = true;
        }
      }
    }
  });

  // Update coin display
  modCoinsDisplay.textContent = totalCoins;
}

// Setup mod unlock button clicks
function setupModUnlockButtons() {
  const unlockButtons = document.querySelectorAll(".mod-unlock-btn");
  unlockButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const box = btn.closest(".mod-box");
      const modId = box.dataset.mod;

      // Find the mod config
      const mods = VEHICLE_MODS[currentModVehicle] || [];
      const mod = mods.find((m) => m.id === modId);
      if (!mod) return;

      // Check if player has enough coins
      if (totalCoins >= mod.price && !isModUnlocked(currentModVehicle, modId)) {
        // Deduct coins
        totalCoins -= mod.price;
        saveTotalCoins(totalCoins);

        // Unlock mod
        unlockMod(currentModVehicle, modId);

        // Update UI
        updateModUI();
        updateCoinsDisplay();

        // Play coin sound
        if (!game.isMuted) {
          coinSound.currentTime = 0;
          coinSound
            .play()
            .catch((e) => console.log("Purchase sound error:", e));
        }
      }
    });
  });
}

// Handle unlock button clicks
function setupUnlockButtons() {
  const unlockButtons = document.querySelectorAll(".vehicle-unlock-btn");
  unlockButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent vehicle selection
      const option = btn.closest(".vehicle-option");
      const vehicleType = option.dataset.vehicle;
      const price = VEHICLE_PRICES[vehicleType];

      // Check if player has enough coins
      if (totalCoins >= price) {
        // Deduct coins
        totalCoins -= price;
        saveTotalCoins(totalCoins);

        // Unlock vehicle
        unlockVehicle(vehicleType);

        // Update UI
        updateVehicleUI();

        // Play coin sound (but reverse it or use a different sound for purchase)
        if (!game.isMuted) {
          coinSound.currentTime = 0;
          coinSound
            .play()
            .catch((e) => console.log("Purchase sound error:", e));
        }
      }
    });
  });
}

// Handle modify button clicks
function setupModifyButtons() {
  const modifyButtons = document.querySelectorAll(".vehicle-modify-btn");
  modifyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent vehicle selection
      const option = btn.closest(".vehicle-option");
      const vehicleType = option.dataset.vehicle;

      // Open modification screen for this vehicle
      openModScreen(vehicleType);
    });
  });
}

// Open modification screen for a vehicle
function openModScreen(vehicleType) {
  currentModVehicle = vehicleType;

  // Hide menu, show mod screen
  menuScreen.classList.add("hidden");
  modScreen.classList.remove("hidden");

  // Update vehicle name
  const vehicleNames = {
    motorcycle: "MOTORCYCLE",
    car: "SPORTS CAR",
    truck: "MONSTER TRUCK",
  };
  modVehicleName.textContent =
    vehicleNames[vehicleType] || vehicleType.toUpperCase();

  // Draw the vehicle preview
  drawModVehiclePreview(vehicleType);

  // Update mod boxes for this vehicle
  updateModUI();

  // Update coins display
  updateCoinsDisplay();
}

// Close modification screen and return to menu
function closeModScreen() {
  modScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
}

// Draw vehicle preview on mod screen
function drawModVehiclePreview(vehicleType) {
  const ctx = modVehicleCanvas.getContext("2d");
  const centerX = modVehicleCanvas.width / 2;
  const centerY = modVehicleCanvas.height / 2;
  const vehicle = VEHICLES[vehicleType];

  // Clear canvas
  ctx.clearRect(0, 0, modVehicleCanvas.width, modVehicleCanvas.height);

  // Draw the vehicle at scale 2
  vehicle.draw(ctx, centerX, centerY, 2);
}

// Vehicle selection
const vehicleOptions = document.querySelectorAll(".vehicle-option");
vehicleOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const vehicleType = option.dataset.vehicle;

    // Only allow selection if vehicle is unlocked
    if (isVehicleUnlocked(vehicleType)) {
      vehicleOptions.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
      selectedVehicle = vehicleType;
    }
  });
});

// Select first unlocked vehicle by default
const firstUnlocked = Array.from(vehicleOptions).find((option) =>
  isVehicleUnlocked(option.dataset.vehicle)
);
if (firstUnlocked) {
  firstUnlocked.classList.add("selected");
  selectedVehicle = firstUnlocked.dataset.vehicle;
}

// Start game button
startGameBtn.addEventListener("click", startGame);

// Resume button
resumeBtn.addEventListener("click", () => {
  game.isPaused = false;
  pauseMenu.classList.add("hidden");
  if (!game.isMuted) {
    bgMusic.play();
  }
});

// Menu button (from pause menu)
menuBtn.addEventListener("click", () => {
  // Play pause menu sound
  if (!game.isMuted) {
    pauseMenuSound.currentTime = 0;
    pauseMenuSound
      .play()
      .catch((e) => console.log("Pause menu sound error:", e));
  }
  showMenu();
});

// Menu button (from game over)
menuFromGameOverBtn.addEventListener("click", () => {
  // Play pause menu sound
  if (!game.isMuted) {
    pauseMenuSound.currentTime = 0;
    pauseMenuSound
      .play()
      .catch((e) => console.log("Pause menu sound error:", e));
  }
  showMenu();
});

// Back to menu button (from mod screen)
backToMenuBtn.addEventListener("click", () => {
  // Play pause menu sound
  if (!game.isMuted) {
    pauseMenuSound.currentTime = 0;
    pauseMenuSound
      .play()
      .catch((e) => console.log("Pause menu sound error:", e));
  }
  closeModScreen();
});

// ==================== ACHIEVEMENTS SCREEN ====================

// Function to create achievement card element
function createAchievementCard(achievement, isUnlocked) {
  const card = document.createElement("div");
  card.className = `achievement-card ${isUnlocked ? "" : "locked"}`;
  card.innerHTML = `
    <div class="achievement-card-icon">🏆</div>
    <div class="achievement-card-content">
      <h3 class="achievement-card-title">${achievement.name}</h3>
      <p class="achievement-card-description">${achievement.description}</p>
    </div>
  `;
  return card;
}

// Function to populate achievements screen
function populateAchievementsScreen() {
  // Clear existing lists
  unlockedAchievementsList.innerHTML = "";
  lockedAchievementsList.innerHTML = "";

  const unlockedAchievements = [];
  const lockedAchievements = [];

  // Separate achievements into unlocked and locked
  Object.values(ACHIEVEMENTS).forEach((achievement) => {
    if (achievement.unlocked) {
      unlockedAchievements.push(achievement);
    } else {
      lockedAchievements.push(achievement);
    }
  });

  // Populate unlocked achievements
  if (unlockedAchievements.length > 0) {
    unlockedAchievements.forEach((achievement) => {
      unlockedAchievementsList.appendChild(
        createAchievementCard(achievement, true)
      );
    });
  } else {
    unlockedAchievementsList.innerHTML =
      '<div class="achievements-empty">No achievements unlocked yet. Start playing to unlock them!</div>';
  }

  // Populate locked achievements
  if (lockedAchievements.length > 0) {
    lockedAchievements.forEach((achievement) => {
      lockedAchievementsList.appendChild(
        createAchievementCard(achievement, false)
      );
    });
  } else {
    lockedAchievementsList.innerHTML =
      '<div class="achievements-empty">All achievements unlocked! 🎉</div>';
  }

  // Update coins display
  achievementsCoinsDisplay.textContent = totalCoins;
}

// Things To Know overlay
thingsToKnowBtn.addEventListener("click", () => {
  thingsToKnowOverlay.classList.remove("hidden");
});

closeThingsToKnowBtn.addEventListener("click", (e) => {
  thingsToKnowOverlay.classList.add("hidden");
});

// Close overlay when clicking outside the content
thingsToKnowOverlay.addEventListener("click", (e) => {
  if (e.target === thingsToKnowOverlay) {
    thingsToKnowOverlay.classList.add("hidden");
  }
});

// Open achievements screen
achievementsBtn.addEventListener("click", () => {
  menuScreen.classList.add("hidden");
  menuCoinDisplay.style.display = "none";
  achievementsBtn.style.display = "none";
  achievementsScreen.classList.remove("hidden");
  populateAchievementsScreen();
});

// Back to menu from achievements
backToMenuFromAchievements.addEventListener("click", () => {
  achievementsScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
  menuCoinDisplay.style.display = "flex";
  achievementsBtn.style.display = "flex";
});

// ==================== END ACHIEVEMENTS SCREEN ====================

// Draw vehicle previews in menu
function drawVehiclePreviews() {
  vehicleOptions.forEach((option) => {
    const previewCanvas = option.querySelector(".vehicle-preview");
    const previewCtx = previewCanvas.getContext("2d");
    const vehicleType = option.dataset.vehicle;
    const vehicle = VEHICLES[vehicleType];

    // Clear canvas
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Draw vehicle in center
    vehicle.draw(
      previewCtx,
      previewCanvas.width / 2,
      previewCanvas.height / 2,
      1.5
    );
  });
}

// Initialize menu
drawVehiclePreviews();
setupUnlockButtons();
setupModifyButtons();
setupModUnlockButtons();
updateVehicleUI();

// Initialize coins display
updateCoinsDisplay();

// ==================== LEGEND RENDERING ====================

// Render sprites in the game legend
function renderLegend() {
  // Obstacle
  const obstacleCanvas = document.getElementById("legendObstacle");
  if (obstacleCanvas) {
    const ctx = obstacleCanvas.getContext("2d");
    const centerX = 20;
    const centerY = 20;
    const size = 24;

    // Draw red crate
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);

    // Add border
    ctx.strokeStyle = "#c0392b";
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - size / 2, centerY - size / 2, size, size);
  }

  // Heart
  const heartCanvas = document.getElementById("legendHeart");
  if (heartCanvas) {
    const ctx = heartCanvas.getContext("2d");
    const centerX = 20;
    const centerY = 20;
    const heartSize = 12;

    ctx.fillStyle = "#FF0000";
    ctx.beginPath();

    // Draw heart using bezier curves
    ctx.moveTo(centerX, centerY + heartSize * 0.3);

    // Left side
    ctx.bezierCurveTo(
      centerX,
      centerY,
      centerX - heartSize * 0.5,
      centerY - heartSize * 0.5,
      centerX - heartSize,
      centerY
    );
    ctx.bezierCurveTo(
      centerX - heartSize,
      centerY + heartSize * 0.3,
      centerX - heartSize * 0.5,
      centerY + heartSize * 0.7,
      centerX,
      centerY + heartSize
    );

    // Right side
    ctx.bezierCurveTo(
      centerX + heartSize * 0.5,
      centerY + heartSize * 0.7,
      centerX + heartSize,
      centerY + heartSize * 0.3,
      centerX + heartSize,
      centerY
    );
    ctx.bezierCurveTo(
      centerX + heartSize * 0.5,
      centerY - heartSize * 0.5,
      centerX,
      centerY,
      centerX,
      centerY + heartSize * 0.3
    );

    ctx.fill();

    // Add shine effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(
      centerX - heartSize * 0.3,
      centerY - heartSize * 0.1,
      heartSize * 0.2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Coin
  const coinCanvas = document.getElementById("legendCoin");
  if (coinCanvas) {
    const ctx = coinCanvas.getContext("2d");
    const centerX = 20;
    const centerY = 20;
    const coinRadius = 14;

    // Draw gold coin
    ctx.fillStyle = "#FFD700";
    ctx.strokeStyle = "#DAA520";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, coinRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Add inner circle
    ctx.strokeStyle = "#DAA520";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coinRadius * 0.7, 0, Math.PI * 2);
    ctx.stroke();

    // Add $ symbol
    ctx.fillStyle = "#8B6914";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$", centerX, centerY);
  }

  // Shield
  const shieldCanvas = document.getElementById("legendShield");
  if (shieldCanvas) {
    const ctx = shieldCanvas.getContext("2d");
    const centerX = 20;
    const centerY = 20;
    const shieldRadius = 16;

    // Draw light blue bubble
    ctx.fillStyle = "rgba(173, 216, 230, 0.6)";
    ctx.beginPath();
    ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
    ctx.fill();

    // Add border
    ctx.strokeStyle = "#87CEEB";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Add shine effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(centerX - 5, centerY - 5, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bomb
  const bombCanvas = document.getElementById("legendBomb");
  if (bombCanvas) {
    const ctx = bombCanvas.getContext("2d");
    const centerX = 20;
    const centerY = 20;
    const bombRadius = 14;

    // Draw black cannonball
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(centerX, centerY, bombRadius, 0, Math.PI * 2);
    ctx.fill();

    // Add shadow/3D effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.arc(centerX - 5, centerY - 5, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw fuse
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(centerX + 8, centerY - bombRadius * 0.7);
    ctx.lineTo(centerX + 15, centerY - bombRadius * 1.1);
    ctx.stroke();

    // Draw spark at end of fuse
    ctx.fillStyle = "#FF4500";
    ctx.beginPath();
    ctx.arc(centerX + 15, centerY - bombRadius * 1.1, 3, 0, Math.PI * 2);
    ctx.fill();

    // Add flicker effect
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(centerX + 16, centerY - bombRadius * 1.15, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Render legend on page load
renderLegend();

// Legend toggle functionality
const legendToggle = document.getElementById("legendToggle");
const legendContent = document.getElementById("legendContent");

if (legendToggle && legendContent) {
  legendToggle.addEventListener("click", () => {
    legendContent.classList.toggle("collapsed");
    legendToggle.classList.toggle("collapsed");
  });
}

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Start game and music
gameLoop();

// Start music when user interacts with the page (browser requirement)
document.addEventListener(
  "click",
  () => {
    if (!game.isMuted && bgMusic.paused) {
      bgMusic.play().catch((e) => console.log("Audio autoplay prevented:", e));
    }
  },
  { once: true }
);
