// Spawners - Entity spawning logic
import { GAME_CONFIG } from './config.js';

export class Spawner {
  constructor() {}

  // Get lanes that are safe to spawn obstacles in (prevents undodgeable walls)
  getSafeLanes(obstacles, lanes) {
    // Check if ANY obstacle exists in the danger zone at the top
    const DANGER_ZONE_HEIGHT = GAME_CONFIG.DANGER_ZONE_HEIGHT;

    const hasObstacleInDangerZone = obstacles.some((obstacle) => {
      return obstacle.y >= -GAME_CONFIG.TILE_HEIGHT && obstacle.y <= DANGER_ZONE_HEIGHT;
    });

    // If ANY obstacle is in the danger zone, don't spawn anything
    if (hasObstacleInDangerZone) {
      return [];
    }

    // All lanes are safe - return all lanes
    return Array.from({ length: lanes }, (_, i) => i);
  }

  // Spawn obstacle
  spawnObstacle(obstacles, spawnChance, lanes) {
    if (Math.random() < spawnChance) {
      // Check which lanes are safe to spawn in
      const safeLanes = this.getSafeLanes(obstacles, lanes);

      // If all lanes are blocked nearby, skip spawning
      if (safeLanes.length === 0) {
        return;
      }

      // Choose a random lane from safe lanes
      const lane = safeLanes[Math.floor(Math.random() * safeLanes.length)];
      obstacles.push({
        lane: lane,
        y: -GAME_CONFIG.TILE_HEIGHT,
      });
    }
  }

  // Spawn shield powerup
  spawnShield(powerups, lanes) {
    if (Math.random() < GAME_CONFIG.SHIELD_SPAWN_CHANCE) {
      const lane = Math.floor(Math.random() * lanes);
      powerups.push({
        type: 'shield',
        lane: lane,
        y: -GAME_CONFIG.TILE_HEIGHT,
      });
    }
  }

  // Spawn bomb
  spawnBomb(powerups, lanes) {
    if (Math.random() < GAME_CONFIG.BOMB_SPAWN_CHANCE) {
      const lane = Math.floor(Math.random() * lanes);
      powerups.push({
        type: 'bomb',
        lane: lane,
        y: -GAME_CONFIG.TILE_HEIGHT,
      });
    }
  }

  // Spawn heart powerup
  spawnHeart(powerups, lanes, heartSpawnMultiplier = 1) {
    const heartSpawnChance = GAME_CONFIG.HEART_SPAWN_CHANCE * heartSpawnMultiplier;

    if (Math.random() < heartSpawnChance) {
      const lane = Math.floor(Math.random() * lanes);
      powerups.push({
        type: 'heart',
        lane: lane,
        y: -GAME_CONFIG.TILE_HEIGHT,
      });
    }
  }

  // Spawn coin collectible
  spawnCoin(powerups, lanes) {
    if (Math.random() < GAME_CONFIG.COIN_SPAWN_CHANCE) {
      const lane = Math.floor(Math.random() * lanes);
      powerups.push({
        type: 'coin',
        lane: lane,
        y: -GAME_CONFIG.TILE_HEIGHT,
      });
    }
  }
}
