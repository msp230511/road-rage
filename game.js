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
const milestone1000Sound = document.getElementById("milestone1000Sound");
const milestone2000Sound = document.getElementById("milestone2000Sound");
const milestone3000Sound = document.getElementById("milestone3000Sound");

// Game over sound effects array
const gameOverSounds = [
  document.getElementById("gameOverSound1"),
  document.getElementById("gameOverSound2"),
  document.getElementById("gameOverSound3"),
  document.getElementById("gameOverSound4"),
  document.getElementById("gameOverSound5"),
  document.getElementById("gameOverSound6"),
];

// Menu elements
const menuScreen = document.getElementById("menuScreen");
const startGameBtn = document.getElementById("startGameBtn");
const pauseMenu = document.getElementById("pauseMenu");
const resumeBtn = document.getElementById("resumeBtn");
const menuBtn = document.getElementById("menuBtn");
const menuFromGameOverBtn = document.getElementById("menuFromGameOverBtn");
const menuCoinsDisplay = document.getElementById("menuCoins");

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
  4000: { speed: 20, spawnChance: 0.6 }, // Max difficulty
  4500: { speed: 20, spawnChance: 0.65 },
  5000: { speed: 20, spawnChance: 0.7 },
  5500: { speed: 22, spawnChance: 0.7 },
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

// Game state
let selectedVehicle = "motorcycle"; // Default vehicle selection
let totalCoins = loadTotalCoins(); // Persistent coin counter
let unlockedVehicles = loadUnlockedVehicles(); // Persistent unlocked vehicles

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
};

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

    // Adjust motorcycle position to keep it in a valid lane
    // Center the motorcycle in the middle lane of the expanded lanes
    game.motorcycle.lane = Math.floor(EXPANDED_LANES / 2); // Center lane (lane 2 for 5 lanes)
  }
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    moveLane(-1);
  } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    moveLane(1);
  } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
    game.isBoosting = true;
  }
});

document.addEventListener("keyup", (e) => {
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
  if (Math.random() < HEART_SPAWN_CHANCE) {
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

  // Calculate actual speed (double if boosting)
  const actualSpeed = game.isBoosting
    ? game.currentSpeed * 2
    : game.currentSpeed;

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
        // Play bubble sound
        if (!game.isMuted) {
          bubbleSound.currentTime = 0;
          bubbleSound
            .play()
            .catch((e) => console.log("Bubble sound error:", e));
        }
      } else if (powerup.type === "bomb") {
        // Instant game over when hitting bomb
        game.health = 0;
        // Play explosion sound
        if (!game.isMuted) {
          explosionSound.currentTime = 0;
          explosionSound
            .play()
            .catch((e) => console.log("Explosion sound error:", e));
        }
        gameOver();
      } else if (powerup.type === "heart") {
        // Add 1 health point
        game.health++;
        healthDisplay.textContent = game.health;
      } else if (powerup.type === "coin") {
        // Collect coin and add to total
        totalCoins++;
        saveTotalCoins(totalCoins);
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
      // Shield absorbs the hit
      if (game.hasShield) {
        game.hasShield = false;
        // Play hitmarker sound when shield absorbs hit
        if (!game.isMuted) {
          hitmarkerSound.currentTime = 0;
          hitmarkerSound
            .play()
            .catch((e) => console.log("Hitmarker sound error:", e));
        }
        return false; // Remove obstacle
      }

      // No shield, take damage
      game.health--;
      healthDisplay.textContent = game.health;
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
      return false; // Remove obstacle after collision
    }

    // Remove obstacles that are off screen
    if (obstacle.y > canvas.height) {
      game.score += 10;
      scoreDisplay.textContent = game.score;

      // Update high score if current score exceeds it
      if (game.score > game.highScore) {
        game.highScore = game.score;
        saveHighScore(game.highScore);
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
}

function gameOver() {
  game.isRunning = false;
  finalScoreDisplay.textContent = game.score;
  gameOverScreen.classList.remove("hidden");
  bgMusic.pause();

  // Play random game over sound effect
  if (!game.isMuted) {
    const randomSound =
      gameOverSounds[Math.floor(Math.random() * gameOverSounds.length)];
    randomSound.currentTime = 0;
    randomSound.play().catch((e) => console.log("Game over sound error:", e));
  }
}

function restart() {
  const wasMuted = game.isMuted;
  const currentHighScore = game.highScore;
  const currentVehicle = game.vehicleType;

  // Reset canvas to initial width
  canvas.width = 800;

  game = {
    health: 3,
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
    hasShield: false,
    keys: {},
    currentSpeed: DEFAULT_SCROLL_SPEED,
    currentSpawnChance: DEFAULT_OBSTACLE_SPAWN_CHANCE,
    isMuted: wasMuted,
    isBoosting: false,
    lanes: INITIAL_LANES,
    laneWidth: canvas.width / INITIAL_LANES,
    vehicleType: currentVehicle,
    milestonesReached: {},
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
}

function startGame() {
  menuScreen.classList.add("hidden");

  const wasMuted = game.isMuted;
  const currentHighScore = game.highScore;

  // Reset canvas to initial width
  canvas.width = 800;

  game = {
    health: 3,
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
    hasShield: false,
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
          coinSound.play().catch((e) => console.log("Purchase sound error:", e));
        }
      }
    });
  });
}

// Handle modify button clicks (placeholder for now)
function setupModifyButtons() {
  const modifyButtons = document.querySelectorAll(".vehicle-modify-btn");
  modifyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent vehicle selection
      const option = btn.closest(".vehicle-option");
      const vehicleType = option.dataset.vehicle;

      // TODO: Open modification menu for this vehicle
      console.log("Modify vehicle:", vehicleType);
    });
  });
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
updateVehicleUI();

// Initialize coins display
updateCoinsDisplay();

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
