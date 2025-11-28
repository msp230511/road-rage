// Game State Management
import { GAME_CONFIG, DIFFICULTY_CONFIG } from './config.js';
import { Storage } from './storage.js';

export class GameState {
  constructor(vehicleSystem) {
    this.vehicleSystem = vehicleSystem;
    this.reset();
  }

  reset() {
    this.health = GAME_CONFIG.DEFAULT_HEALTH;
    this.score = 0;
    this.highScore = Storage.loadHighScore();
    this.isRunning = false;
    this.isPaused = false;
    this.scrollOffset = 0;
    this.motorcycle = {
      lane: 1,
      row: 15,
    };
    this.obstacles = [];
    this.powerups = [];
    this.hasShield = false;
    this.shieldHits = 0;
    this.currentSpeed = GAME_CONFIG.DEFAULT_SCROLL_SPEED;
    this.currentSpawnChance = GAME_CONFIG.DEFAULT_OBSTACLE_SPAWN_CHANCE;
    this.isBoosting = false;
    this.lanes = GAME_CONFIG.INITIAL_LANES;
    this.laneWidth = GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.INITIAL_LANES;
    this.vehicleType = this.vehicleSystem.getSelectedVehicle();
    this.milestonesReached = {};

    // Achievement tracking
    this.damageTaken = false;
    this.coinsThisGame = 0;
    this.consecutiveBombDeaths = 0;
    this.lastDeathWasBomb = false;

    // Debug mode
    this.debug = {
      customStartHealth: null,
      invincibility: false,
    };
  }

  // Apply mods on game start
  applyStartMods() {
    // Check if should start with shield
    if (this.vehicleSystem.hasModEffect('startWithShield')) {
      this.hasShield = true;
      this.shieldHits = this.vehicleSystem.hasModEffect('shieldDoubleHit') ? 2 : 1;
    }

    // Apply max health mod
    if (this.vehicleSystem.hasModEffect('maxHealth5')) {
      this.health = 5;
    }

    // Apply debug custom health if set
    if (this.debug.customStartHealth !== null) {
      this.health = this.debug.customStartHealth;
    }
  }

  // Update difficulty based on score
  updateDifficulty() {
    const thresholds = Object.keys(DIFFICULTY_CONFIG)
      .map(Number)
      .sort((a, b) => b - a); // Sort descending

    for (const threshold of thresholds) {
      if (this.score >= threshold) {
        const config = DIFFICULTY_CONFIG[threshold];
        this.currentSpeed = config.speed;
        this.currentSpawnChance = config.spawnChance;
        return;
      }
    }

    const config = DIFFICULTY_CONFIG[0];
    this.currentSpeed = config.speed;
    this.currentSpawnChance = config.spawnChance;
  }

  // Update lane expansion
  updateLaneExpansion(canvas) {
    if (this.score >= GAME_CONFIG.LANE_EXPANSION_THRESHOLD && this.lanes === GAME_CONFIG.INITIAL_LANES) {
      this.lanes = GAME_CONFIG.EXPANDED_LANES;

      // Expand canvas width dynamically
      const oldCanvasWidth = canvas.width;
      const newCanvasWidth = Math.floor(
        oldCanvasWidth * (GAME_CONFIG.EXPANDED_LANES / GAME_CONFIG.INITIAL_LANES)
      );
      canvas.width = newCanvasWidth;

      this.laneWidth = canvas.width / GAME_CONFIG.EXPANDED_LANES;

      // Center the motorcycle in the middle lane of the expanded lanes
      this.motorcycle.lane = Math.floor(GAME_CONFIG.EXPANDED_LANES / 2);
    }
  }

  // Move motorcycle to a different lane
  moveLane(direction) {
    if (!this.isRunning) return;

    const newLane = this.motorcycle.lane + direction;
    if (newLane >= 0 && newLane < this.lanes) {
      this.motorcycle.lane = newLane;
    }
  }

  // Update scroll and entity positions
  update(boostMultiplier) {
    const actualSpeed = this.currentSpeed * boostMultiplier;
    this.scrollOffset += actualSpeed;

    // Update obstacles
    this.obstacles.forEach((obstacle) => {
      obstacle.y += actualSpeed;
    });

    // Update powerups
    this.powerups.forEach((powerup) => {
      powerup.y += actualSpeed;
    });
  }

  // Save high score
  saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      Storage.saveHighScore(this.highScore);
    }
  }

  // Preserve state between restarts
  preserveForRestart() {
    return {
      isMuted: this.isMuted,
      highScore: this.highScore,
      vehicleType: this.vehicleType,
      consecutiveBombDeaths: this.consecutiveBombDeaths,
      debug: { ...this.debug },
    };
  }

  restoreFromPreserved(preserved) {
    this.isMuted = preserved.isMuted;
    this.highScore = preserved.highScore;
    this.vehicleType = preserved.vehicleType;
    this.consecutiveBombDeaths = preserved.consecutiveBombDeaths;
    this.debug = preserved.debug;
  }
}
