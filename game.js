// Main Game - Orchestrates all modules
import { GAME_CONFIG } from './js/config.js';
import { Storage } from './js/storage.js';
import { VehicleSystem, MOD_DATA } from './js/vehicle-system.js';
import { AchievementSystem } from './js/achievements.js';
import { AudioManager } from './js/audio.js';
import { Renderer, LegendRenderer } from './js/renderer.js';
import { Spawner } from './js/spawners.js';
import { CollisionDetector } from './js/collision.js';
import { GameState } from './js/game-state.js';
import { InputHandler } from './js/input.js';
import {
  BananaRoastSystem,
  showGoldenSparkle,
  AchievementNotificationSystem,
  MilestoneSystem,
  updateCoinsDisplay,
  updateGameUI,
  DebugMode,
} from './js/ui-utils.js';

// ==================== INITIALIZATION ====================

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initialize systems
const vehicleSystem = new VehicleSystem();
const achievementSystem = new AchievementSystem();
const audioManager = new AudioManager();
const renderer = new Renderer(canvas, ctx);
const spawner = new Spawner();
const collisionDetector = new CollisionDetector(audioManager, achievementSystem);
const gameState = new GameState(vehicleSystem);
const inputHandler = new InputHandler();

// UI systems
const bananaRoast = new BananaRoastSystem();
const achievementNotifications = new AchievementNotificationSystem();
const milestones = new MilestoneSystem(audioManager);
const debugMode = new DebugMode();

// Total coins (persistent across games)
let totalCoins = Storage.loadTotalCoins();

// Setup achievement notifications
achievementSystem.onNotification((achievement) => {
  achievementNotifications.show(achievement);
});

// ==================== GAME LOOP ====================

function update() {
  if (!gameState.isRunning || gameState.isPaused) return;

  // Update difficulty and lane expansion
  gameState.updateDifficulty();
  gameState.updateLaneExpansion(canvas);
  milestones.check(gameState.score);

  // Handle input
  const laneMovement = inputHandler.getMovement();
  if (laneMovement !== 0) {
    gameState.moveLane(laneMovement);
  }

  gameState.isBoosting = inputHandler.isBoosting();
  const boostMultiplier = gameState.isBoosting
    ? GAME_CONFIG.BOOST_MULTIPLIER * vehicleSystem.getModEffectValue('boostSpeed25', 1)
    : 1;

  // Update positions
  gameState.update(boostMultiplier);

  // Spawn entities
  const heartSpawnMultiplier = vehicleSystem.getModEffectValue('heartSpawnBoost', 1);
  spawner.spawnObstacle(gameState.obstacles, gameState.currentSpawnChance, gameState.lanes);
  spawner.spawnShield(gameState.powerups, gameState.lanes);
  spawner.spawnBomb(gameState.powerups, gameState.lanes);
  spawner.spawnHeart(gameState.powerups, gameState.lanes, heartSpawnMultiplier);
  spawner.spawnCoin(gameState.powerups, gameState.lanes);

  // Handle collisions
  collisionDetector.handlePowerupCollection(
    gameState,
    vehicleSystem,
    () => showGoldenSparkle(gameState.motorcycle, gameState.laneWidth)
  );

  // Update coins
  if (gameState.coinsThisGame > 0) {
    const coinValue = Math.floor(vehicleSystem.getModEffectValue('coinValue2x', 1));
    totalCoins += coinValue;
    gameState.coinsThisGame = 0;
    Storage.saveTotalCoins(totalCoins);
    updateCoinsDisplay(totalCoins);
  }

  // Check achievement for coins
  achievementSystem.checkUncleScrooge(totalCoins);

  collisionDetector.handleObstacleCollision(
    gameState,
    vehicleSystem,
    () => gameOver(),
    () => bananaRoast.show(),
    () => showGoldenSparkle(gameState.motorcycle, gameState.laneWidth)
  );

  // Update UI
  updateGameUI(gameState);
  gameState.saveHighScore();
}

function render() {
  if (!gameState.isRunning && !gameState.isPaused) return;

  const vehicleData = vehicleSystem.getVehicleData(gameState.vehicleType);
  renderer.render(gameState, (ctx, x, y) => {
    vehicleData.drawFunction(ctx, x, y);
  });
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// ==================== GAME FLOW ====================

function startGame() {
  hideMenu();
  gameState.reset();
  gameState.vehicleType = vehicleSystem.getSelectedVehicle();
  gameState.applyStartMods();
  gameState.isRunning = true;
  milestones.reset();

  updateGameUI(gameState);
  audioManager.restartMusic();

  // Hide legend
  document.querySelector('.game-legend')?.classList.add('hidden');
}

function restart() {
  const preserved = gameState.preserveForRestart();
  gameState.reset();
  gameState.restoreFromPreserved(preserved);
  gameState.applyStartMods();
  gameState.isRunning = true;
  milestones.reset();

  // Reset canvas
  canvas.width = GAME_CONFIG.CANVAS_WIDTH;

  updateGameUI(gameState);
  hideGameOver();
  audioManager.restartMusic();
}

function gameOver() {
  gameState.isRunning = false;
  audioManager.pauseMusic();
  audioManager.playRandomGameOver();

  // Check achievements
  achievementSystem.checkIdiot(gameState.score);
  if (gameState.lastDeathWasBomb) {
    gameState.consecutiveBombDeaths++;
    achievementSystem.checkBombDeaths(gameState.lastDeathWasBomb, gameState.consecutiveBombDeaths);
  } else {
    gameState.consecutiveBombDeaths = 0;
  }

  // Show game over screen
  document.getElementById('finalScore').textContent = gameState.score;
  document.getElementById('gameOver').classList.remove('hidden');
}

function showMenu() {
  document.getElementById('menuScreen').classList.remove('hidden');
  document.getElementById('pauseMenu').classList.add('hidden');
  document.getElementById('gameOver').classList.add('hidden');
  document.querySelector('.game-legend')?.classList.remove('hidden');
  gameState.isRunning = false;
  gameState.isPaused = false;
  audioManager.pauseMusic();
  audioManager.setMuted(false);
}

function hideMenu() {
  document.getElementById('menuScreen').classList.add('hidden');
}

function hideGameOver() {
  document.getElementById('gameOver').classList.add('hidden');
}

// ==================== UI HANDLERS ====================

// Pause/Resume
document.getElementById('pauseBtn')?.addEventListener('click', () => {
  if (!gameState.isRunning) return;
  gameState.isPaused = true;
  audioManager.pauseMusic();
  audioManager.playPauseMenu();
  document.getElementById('pauseMenu').classList.remove('hidden');
});

document.getElementById('resumeBtn')?.addEventListener('click', () => {
  gameState.isPaused = false;
  document.getElementById('pauseMenu').classList.add('hidden');
  audioManager.playMusic();
});

// Mute
document.getElementById('muteBtn')?.addEventListener('click', () => {
  const isMuted = audioManager.toggleMute();
  document.getElementById('muteBtn').textContent = isMuted ? '🔇' : '🔊';
});

// Menu navigation
document.getElementById('startGameBtn')?.addEventListener('click', startGame);
document.getElementById('restartBtn')?.addEventListener('click', restart);
document.getElementById('menuBtn')?.addEventListener('click', () => {
  audioManager.playPauseMenu();
  showMenu();
});
document.getElementById('menuFromGameOverBtn')?.addEventListener('click', () => {
  audioManager.playPauseMenu();
  showMenu();
});

// Things To Know overlay
document.getElementById('thingsToKnowBtn')?.addEventListener('click', () => {
  document.getElementById('thingsToKnowOverlay').classList.remove('hidden');
});
document.getElementById('closeThingsToKnowBtn')?.addEventListener('click', () => {
  document.getElementById('thingsToKnowOverlay').classList.add('hidden');
});
document.getElementById('thingsToKnowOverlay')?.addEventListener('click', (e) => {
  if (e.target.id === 'thingsToKnowOverlay') {
    e.target.classList.add('hidden');
  }
});

// Achievements screen
document.getElementById('achievementsBtn')?.addEventListener('click', () => {
  populateAchievementsScreen();
  document.getElementById('menuScreen').classList.add('hidden');
  document.getElementById('achievementsScreen').classList.remove('hidden');
});

document.getElementById('backToMenuFromAchievements')?.addEventListener('click', () => {
  document.getElementById('achievementsScreen').classList.add('hidden');
  document.getElementById('menuScreen').classList.remove('hidden');
});

// ==================== VEHICLE & MOD UI ====================

function updateVehicleUI() {
  const vehicleOptions = document.querySelectorAll('.vehicle-option');
  vehicleOptions.forEach((option) => {
    const vehicleType = option.dataset.vehicle;
    const isUnlocked = vehicleSystem.isVehicleUnlocked(vehicleType);
    const lockOverlay = option.querySelector('.lock-overlay');
    const unlockBtn = option.querySelector('.vehicle-unlock-btn');
    const modifyBtn = option.querySelector('.vehicle-modify-btn');
    const previewContainer = option.querySelector('.vehicle-preview-container');

    if (isUnlocked) {
      // Vehicle is unlocked
      if (lockOverlay) lockOverlay.style.display = 'none';
      if (unlockBtn) unlockBtn.style.display = 'none';
      if (modifyBtn) modifyBtn.style.display = 'flex';
      if (previewContainer) previewContainer.classList.remove('locked');
      option.style.pointerEvents = 'auto';
      option.style.opacity = '1';
    } else {
      // Vehicle is locked
      if (lockOverlay) lockOverlay.style.display = 'flex';
      if (unlockBtn) unlockBtn.style.display = 'flex';
      if (modifyBtn) modifyBtn.style.display = 'none';
      if (previewContainer) previewContainer.classList.add('locked');
      option.style.opacity = '0.6';

      // Update unlock button disabled state based on coins
      const vehicleData = vehicleSystem.getVehicleData(vehicleType);
      if (unlockBtn) {
        unlockBtn.disabled = totalCoins < vehicleData.price;
      }
    }
  });

  updateCoinsDisplay(totalCoins);
}

function drawVehiclePreviews() {
  document.querySelectorAll('.vehicle-option').forEach((option) => {
    const canvas = option.querySelector('.vehicle-preview');
    const vehicleType = option.dataset.vehicle;
    const vehicleData = vehicleSystem.getVehicleData(vehicleType);

    if (canvas && vehicleData) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      vehicleData.drawFunction(ctx, canvas.width / 2, canvas.height / 2, 1.5);
    }
  });
}

// Vehicle selection
document.querySelectorAll('.vehicle-option').forEach((option) => {
  option.addEventListener('click', () => {
    const vehicleType = option.dataset.vehicle;
    if (vehicleSystem.isVehicleUnlocked(vehicleType)) {
      document.querySelectorAll('.vehicle-option').forEach((opt) => opt.classList.remove('selected'));
      option.classList.add('selected');
      vehicleSystem.setSelectedVehicle(vehicleType);
    }
  });
});

// Unlock vehicles
document.querySelectorAll('.vehicle-unlock-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const option = btn.closest('.vehicle-option');
    const vehicleType = option.dataset.vehicle;
    const vehicleData = vehicleSystem.getVehicleData(vehicleType);

    if (totalCoins >= vehicleData.price) {
      totalCoins -= vehicleData.price;
      Storage.saveTotalCoins(totalCoins);
      vehicleSystem.unlockVehicle(vehicleType);
      updateVehicleUI();
      audioManager.playCoin();
    }
  });
});

// Modify buttons
document.querySelectorAll('.vehicle-modify-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const option = btn.closest('.vehicle-option');
    const vehicleType = option.dataset.vehicle;
    openModScreen(vehicleType);
  });
});

// Mod screen
let currentModVehicle = 'motorcycle';

function openModScreen(vehicleType) {
  currentModVehicle = vehicleType;
  document.getElementById('menuScreen').classList.add('hidden');
  document.getElementById('modScreen').classList.remove('hidden');

  const vehicleData = vehicleSystem.getVehicleData(vehicleType);
  document.getElementById('modVehicleName').textContent = vehicleData.name;

  // Draw vehicle preview
  const modCanvas = document.getElementById('modVehicleCanvas');
  const modCtx = modCanvas.getContext('2d');
  modCtx.clearRect(0, 0, modCanvas.width, modCanvas.height);
  vehicleData.drawFunction(modCtx, modCanvas.width / 2, modCanvas.height / 2, 2);

  updateModUI();
  updateCoinsDisplay(totalCoins);
}

function updateModUI() {
  const modBoxes = document.querySelectorAll('.mod-box');
  const mods = MOD_DATA[currentModVehicle] || [];

  modBoxes.forEach((box, index) => {
    if (index >= mods.length) return;

    const mod = mods[index];
    const isUnlocked = vehicleSystem.isModUnlocked(currentModVehicle, mod.id);

    box.dataset.mod = mod.id;
    box.querySelector('.mod-name').textContent = mod.name;
    box.querySelector('.mod-description').textContent = mod.description;

    const lockOverlay = box.querySelector('.lock-overlay');
    const unlockBtn = box.querySelector('.mod-unlock-btn');
    const previewContainer = box.querySelector('.mod-preview-container');

    if (isUnlocked) {
      // Mod is unlocked
      if (lockOverlay) lockOverlay.style.display = 'none';
      if (previewContainer) previewContainer.classList.remove('locked');
      if (unlockBtn) {
        const priceSpan = unlockBtn.querySelector('.unlock-price');
        const coinIcon = unlockBtn.querySelector('.coin-icon');
        if (priceSpan) {
          priceSpan.textContent = 'UNLOCKED';
          priceSpan.style.fontSize = '16px';
        }
        if (coinIcon) coinIcon.style.display = 'none';
        unlockBtn.classList.add('unlocked');
        unlockBtn.disabled = true;
      }
    } else {
      // Mod is locked
      if (lockOverlay) lockOverlay.style.display = 'flex';
      if (previewContainer) previewContainer.classList.add('locked');
      if (unlockBtn) {
        const priceSpan = unlockBtn.querySelector('.unlock-price');
        const coinIcon = unlockBtn.querySelector('.coin-icon');
        if (priceSpan) {
          priceSpan.textContent = mod.price;
          priceSpan.style.fontSize = '18px';
        }
        if (coinIcon) coinIcon.style.display = 'inline';
        unlockBtn.classList.remove('unlocked');
        unlockBtn.disabled = totalCoins < mod.price;
      }
    }
  });
}

document.querySelectorAll('.mod-unlock-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const box = btn.closest('.mod-box');
    const modId = box.dataset.mod;
    const mods = MOD_DATA[currentModVehicle] || [];
    const mod = mods.find((m) => m.id === modId);

    if (mod && totalCoins >= mod.price && !vehicleSystem.isModUnlocked(currentModVehicle, modId)) {
      totalCoins -= mod.price;
      Storage.saveTotalCoins(totalCoins);
      vehicleSystem.unlockMod(currentModVehicle, modId);
      updateModUI();
      updateCoinsDisplay(totalCoins);
      audioManager.playCoin();
    }
  });
});

document.getElementById('backToMenuBtn')?.addEventListener('click', () => {
  audioManager.playPauseMenu();
  document.getElementById('modScreen').classList.add('hidden');
  document.getElementById('menuScreen').classList.remove('hidden');
});

// ==================== ACHIEVEMENTS UI ====================

function populateAchievementsScreen() {
  const unlockedList = document.getElementById('unlockedAchievements');
  const lockedList = document.getElementById('lockedAchievements');

  unlockedList.innerHTML = '';
  lockedList.innerHTML = '';

  const unlocked = achievementSystem.getUnlockedAchievements();
  const locked = achievementSystem.getLockedAchievements();

  if (unlocked.length > 0) {
    unlocked.forEach((achievement) => {
      unlockedList.appendChild(createAchievementCard(achievement, true));
    });
  } else {
    unlockedList.innerHTML =
      '<div class="achievements-empty">No achievements unlocked yet. Start playing to unlock them!</div>';
  }

  if (locked.length > 0) {
    locked.forEach((achievement) => {
      lockedList.appendChild(createAchievementCard(achievement, false));
    });
  } else {
    lockedList.innerHTML = '<div class="achievements-empty">All achievements unlocked! 🎉</div>';
  }
}

function createAchievementCard(achievement, isUnlocked) {
  const card = document.createElement('div');
  card.className = `achievement-card ${isUnlocked ? '' : 'locked'}`;
  card.innerHTML = `
    <div class="achievement-card-icon">🏆</div>
    <div class="achievement-card-content">
      <h3 class="achievement-card-title">${achievement.name}</h3>
      <p class="achievement-card-description">${achievement.description}</p>
    </div>
  `;
  return card;
}

// ==================== LEGEND ====================

const legendToggle = document.getElementById('legendToggle');
const legendContent = document.getElementById('legendContent');

legendToggle?.addEventListener('click', () => {
  legendContent.classList.toggle('collapsed');
  legendToggle.classList.toggle('collapsed');
});

// ==================== DEBUG MODE ====================

// Debug mode activation
setInterval(() => {
  const isActive = inputHandler.isDebugModeActive();
  debugMode.toggle(isActive);

  if (isActive && debugMode.isInvincible()) {
    gameState.debug.invincibility = true;
  } else {
    gameState.debug.invincibility = false;
  }
}, 100);

// ==================== INITIALIZATION ====================

// Initialize menu
drawVehiclePreviews();
updateVehicleUI();
updateCoinsDisplay(totalCoins);
LegendRenderer.renderAll();

// Select first unlocked vehicle (clear any existing selection first)
document.querySelectorAll('.vehicle-option').forEach((opt) => opt.classList.remove('selected'));
const firstUnlocked = Array.from(document.querySelectorAll('.vehicle-option')).find((option) =>
  vehicleSystem.isVehicleUnlocked(option.dataset.vehicle)
);
if (firstUnlocked) {
  firstUnlocked.classList.add('selected');
  vehicleSystem.setSelectedVehicle(firstUnlocked.dataset.vehicle);
}

// Show menu on load
showMenu();

// Start game loop
gameLoop();

// Start music on user interaction
document.addEventListener(
  'click',
  () => {
    if (!audioManager.getMuted()) {
      audioManager.playMusic();
    }
  },
  { once: true }
);
