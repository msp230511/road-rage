// Collision Detection - Handle all collision logic
import { GAME_CONFIG } from './config.js';

export class CollisionDetector {
  constructor(audioManager, achievementSystem) {
    this.audioManager = audioManager;
    this.achievementSystem = achievementSystem;
  }

  // Check if two entities collide
  checkCollision(entity, motorcycleY, motorcycleLane) {
    return (
      entity.lane === motorcycleLane &&
      entity.y >= motorcycleY - GAME_CONFIG.TILE_HEIGHT &&
      entity.y <= motorcycleY + GAME_CONFIG.TILE_HEIGHT
    );
  }

  // Handle powerup collection
  handlePowerupCollection(gameState, vehicleSystem, onGoldenSparkle) {
    const motorcycleY = gameState.motorcycle.row * GAME_CONFIG.TILE_HEIGHT;

    gameState.powerups = gameState.powerups.filter((powerup) => {
      if (this.checkCollision(powerup, motorcycleY, gameState.motorcycle.lane)) {
        return this.processPowerup(powerup, gameState, vehicleSystem, onGoldenSparkle);
      }

      // Remove powerups that are off screen
      if (powerup.y > GAME_CONFIG.CANVAS_HEIGHT) {
        return false;
      }

      return true;
    });
  }

  // Process individual powerup
  processPowerup(powerup, gameState, vehicleSystem, onGoldenSparkle) {
    switch (powerup.type) {
      case 'shield':
        return this.handleShieldCollection(gameState, vehicleSystem);
      case 'bomb':
        return this.handleBombCollection(gameState, vehicleSystem, onGoldenSparkle);
      case 'heart':
        return this.handleHeartCollection(gameState);
      case 'coin':
        return this.handleCoinCollection(gameState, vehicleSystem);
    }
    return false;
  }

  handleShieldCollection(gameState, vehicleSystem) {
    gameState.hasShield = true;
    gameState.shieldHits = vehicleSystem.hasModEffect('shieldDoubleHit') ? 2 : 1;
    this.audioManager.playBubble();
    return false; // Remove powerup
  }

  handleBombCollection(gameState, vehicleSystem, onGoldenSparkle) {
    // Check debug invincibility
    if (gameState.debug && gameState.debug.invincibility) {
      return false; // Remove bomb but don't take damage
    }

    // Check survival chance mods
    if (this.checkSurvivalChance(vehicleSystem)) {
      onGoldenSparkle();
      this.audioManager.playHeroesNeverDie();
      return false; // Remove bomb, survived
    }

    // Fatal bomb damage
    gameState.health = 0;
    gameState.lastDeathWasBomb = true;
    this.audioManager.playExplosion();
    return false; // Remove bomb, player dies
  }

  handleHeartCollection(gameState) {
    gameState.health++;
    this.achievementSystem.checkLovesCardio(gameState.health);
    this.audioManager.playHeartPickup();
    return false; // Remove powerup
  }

  handleCoinCollection(gameState, vehicleSystem) {
    const coinValue = Math.floor(vehicleSystem.getModEffectValue('coinValue2x', 1));
    gameState.coinsThisGame += coinValue;
    this.audioManager.playCoin();
    return false; // Remove powerup
  }

  // Handle obstacle collision
  handleObstacleCollision(gameState, vehicleSystem, onGameOver, onDamageTaken, onGoldenSparkle) {
    const motorcycleY = gameState.motorcycle.row * GAME_CONFIG.TILE_HEIGHT;

    gameState.obstacles = gameState.obstacles.filter((obstacle) => {
      if (this.checkCollision(obstacle, motorcycleY, gameState.motorcycle.lane)) {
        return this.processObstacleHit(gameState, vehicleSystem, onGameOver, onDamageTaken, onGoldenSparkle);
      }

      // Remove obstacles off screen and add score
      if (obstacle.y > GAME_CONFIG.CANVAS_HEIGHT) {
        this.addScore(gameState, vehicleSystem);
        return false;
      }

      return true;
    });
  }

  processObstacleHit(gameState, vehicleSystem, onGameOver, onDamageTaken, onGoldenSparkle) {
    // Check debug invincibility
    if (gameState.debug && gameState.debug.invincibility) {
      return false; // Remove obstacle but take no damage
    }

    // Shield absorbs the hit
    if (gameState.hasShield) {
      gameState.shieldHits--;
      if (gameState.shieldHits <= 0) {
        gameState.hasShield = false;
      }
      this.audioManager.playHitmarker();
      return false; // Remove obstacle
    }

    // Check for survival chance if hit would be fatal
    if (gameState.health - 1 <= 0) {
      if (this.checkSurvivalChance(vehicleSystem)) {
        onGoldenSparkle();
        this.audioManager.playHeroesNeverDie();
        return false; // Remove obstacle, survived
      }
    }

    // Take damage
    gameState.health--;
    gameState.damageTaken = true;
    gameState.lastDeathWasBomb = false;
    onDamageTaken();
    this.audioManager.playHitmarker();

    if (gameState.health <= 0) {
      onGameOver();
    }

    return false; // Remove obstacle
  }

  checkSurvivalChance(vehicleSystem) {
    if (vehicleSystem.hasModEffect('survivalChance35')) {
      return Math.random() < 0.35;
    } else if (vehicleSystem.hasModEffect('survivalChance20')) {
      return Math.random() < 0.2;
    }
    return false;
  }

  addScore(gameState, vehicleSystem) {
    const scoreValue = Math.floor(10 * vehicleSystem.getModEffectValue('scoreMultiplier1_5x', 1));
    gameState.score += scoreValue;

    // Update high score if current score exceeds it
    if (gameState.score > gameState.highScore) {
      gameState.highScore = gameState.score;
    }

    // Check achievements
    this.achievementSystem.checkNoDamageAchievements(gameState.score, gameState.damageTaken);
    this.achievementSystem.checkNoLife(gameState.score);
  }
}
