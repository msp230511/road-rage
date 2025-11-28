// UI Utilities - Banana roasts, sparkles, achievement notifications, etc.
import { BANANA_ROASTS, GAME_CONFIG, MILESTONES } from './config.js';
import { Storage } from './storage.js';

// Banana Roast System
export class BananaRoastSystem {
  constructor() {
    this.speechBubble = document.getElementById('bananaSpeechBubble');
    this.roastText = document.getElementById('roastText');
    this.timeout = null;
  }

  show() {
    // Clear any existing timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Pick a random roast
    const randomRoast = BANANA_ROASTS[Math.floor(Math.random() * BANANA_ROASTS.length)];
    this.roastText.textContent = randomRoast;

    // Show the speech bubble
    this.speechBubble.classList.remove('hidden');

    // Hide after 2.5 seconds
    this.timeout = setTimeout(() => {
      this.speechBubble.classList.add('hidden');
    }, 2500);
  }
}

// Golden Sparkle Effect
export function showGoldenSparkle(motorcycle, laneWidth) {
  const gameContainer = document.querySelector('.game-container');

  const x = motorcycle.lane * laneWidth + laneWidth / 2;
  const y = motorcycle.row * GAME_CONFIG.TILE_HEIGHT + GAME_CONFIG.TILE_HEIGHT / 2;

  const sparkleContainer = document.createElement('div');
  sparkleContainer.className = 'golden-sparkle';
  sparkleContainer.style.left = `${x}px`;
  sparkleContainer.style.top = `${y + 20}px`;
  sparkleContainer.style.fontSize = '48px';
  sparkleContainer.textContent = '✨';

  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'sparkle-particle';

    const angle = (Math.PI * 2 * i) / particleCount;
    const distance = 80 + Math.random() * 40;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    sparkleContainer.appendChild(particle);
  }

  gameContainer.appendChild(sparkleContainer);

  setTimeout(() => {
    sparkleContainer.remove();
  }, 1000);
}

// Achievement Notification System
export class AchievementNotificationSystem {
  constructor() {
    this.container = document.getElementById('achievementContainer');
  }

  show(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-icon">🏆</div>
      <div class="achievement-content">
        <h3 class="achievement-title">${achievement.name}</h3>
        <p class="achievement-description">${achievement.description}</p>
      </div>
    `;

    this.container.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('slide-out');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 4000);
  }
}

// Milestone Sound System
export class MilestoneSystem {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.reached = {};
  }

  check(score) {
    Object.keys(MILESTONES).forEach((milestone) => {
      const milestoneScore = parseInt(milestone);
      if (score >= milestoneScore && !this.reached[milestoneScore]) {
        this.reached[milestoneScore] = true;
        this.audioManager.playMilestone(milestoneScore);
      }
    });
  }

  reset() {
    this.reached = {};
  }
}

// Coins Display Update
export function updateCoinsDisplay(totalCoins) {
  const displays = [
    document.getElementById('coins'),
    document.getElementById('menuCoins'),
    document.getElementById('modCoins'),
  ];

  displays.forEach((display) => {
    if (display) {
      display.textContent = totalCoins;
    }
  });
}

// Update game UI (health and score)
export function updateGameUI(gameState) {
  const healthDisplay = document.getElementById('health');
  const scoreDisplay = document.getElementById('score');

  if (healthDisplay) healthDisplay.textContent = gameState.health;
  if (scoreDisplay) scoreDisplay.textContent = gameState.score;
}

// Debug Mode
export class DebugMode {
  constructor() {
    this.active = false;
    this.overlay = document.getElementById('debugOverlay');
    this.status = document.getElementById('debugStatus');
    this.setupButtons();
  }

  setupButtons() {
    // Apply health
    document.getElementById('debugApplyHealthBtn')?.addEventListener('click', () => {
      const healthValue = parseInt(document.getElementById('debugHealthInput').value);
      if (healthValue > 0 && healthValue <= 100) {
        this.showStatus(`✓ Starting health set to ${healthValue}`);
        return healthValue;
      } else {
        this.showStatus('✗ Health must be 1-100', 2000);
        return null;
      }
    });

    // Add coins
    document.getElementById('debugAddCoinsBtn')?.addEventListener('click', () => {
      const coinsToAdd = parseInt(document.getElementById('debugCoinsInput').value);
      if (coinsToAdd > 0) {
        const newTotal = Storage.loadTotalCoins() + coinsToAdd;
        Storage.saveTotalCoins(newTotal);
        updateCoinsDisplay(newTotal);
        this.showStatus(`✓ Added ${coinsToAdd} coins`);
      }
    });

    // Reset coins
    document.getElementById('debugResetCoinsBtn')?.addEventListener('click', () => {
      Storage.resetCoins();
      updateCoinsDisplay(0);
      this.showStatus('✓ Coins reset to 0');
    });

    // Reset vehicles
    document.getElementById('debugResetVehiclesBtn')?.addEventListener('click', () => {
      Storage.resetVehiclesAndMods();
      this.showStatus('✓ Vehicles locked & mods reset - Reloading...', 1500);
      setTimeout(() => location.reload(), 1500);
    });

    // Reset achievements
    document.getElementById('debugResetAchievementsBtn')?.addEventListener('click', () => {
      Storage.resetAchievements();
      this.showStatus('✓ All achievements reset');
    });
  }

  showStatus(message, duration = 3000) {
    this.status.textContent = message;
    this.status.classList.add('show');
    setTimeout(() => {
      this.status.classList.remove('show');
    }, duration);
  }

  toggle(isActive) {
    this.active = isActive;
    if (isActive) {
      this.overlay.classList.remove('hidden');
    } else {
      this.overlay.classList.add('hidden');
    }
  }

  isInvincible() {
    const checkbox = document.getElementById('debugInvincibilityCheckbox');
    return checkbox ? checkbox.checked : false;
  }
}
