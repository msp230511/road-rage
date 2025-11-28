// Achievements System - Data-driven achievement management
import { Storage } from './storage.js';

// Achievement definitions - extensible configuration
export const ACHIEVEMENT_DATA = {
  idiot: {
    id: 'idiot',
    name: 'Idiot',
    description: 'Die without scoring any points',
    unlocked: false,
  },
  demolitionist: {
    id: 'demolitionist',
    name: 'Demolitionist',
    description: 'Die 3 times in a row due to a bomb',
    unlocked: false,
  },
  kindaCrazy: {
    id: 'kindaCrazy',
    name: 'Kinda Crazy',
    description: 'Take no damage until 500 score',
    unlocked: false,
  },
  touchGrass: {
    id: 'touchGrass',
    name: 'Touch Grass',
    description: 'Take no damage until 1000 score',
    unlocked: false,
  },
  noLife: {
    id: 'noLife',
    name: 'No Life',
    description: 'Reach 10000 score',
    unlocked: false,
  },
  lovesCardio: {
    id: 'lovesCardio',
    name: 'Loves Cardio',
    description: 'Hit a balance of 10 hearts in any game',
    unlocked: false,
  },
  uncleScrooge: {
    id: 'uncleScrooge',
    name: 'Uncle Scrooge',
    description: 'Collect 25 coins in one game',
    unlocked: false,
  },
};

// Achievement System class
export class AchievementSystem {
  constructor() {
    this.achievements = { ...ACHIEVEMENT_DATA };
    this.loadAchievements();
    this.notificationCallbacks = [];
  }

  // Load achievements from storage
  loadAchievements() {
    const saved = Storage.loadAchievements();
    if (saved) {
      // Merge saved achievements with default achievements
      Object.keys(this.achievements).forEach((key) => {
        if (saved[key]) {
          this.achievements[key].unlocked = saved[key].unlocked;
        }
      });
    }
  }

  // Save achievements to storage
  saveAchievements() {
    Storage.saveAchievements(this.achievements);
  }

  // Check if an achievement is unlocked
  isUnlocked(achievementId) {
    return this.achievements[achievementId]?.unlocked || false;
  }

  // Unlock an achievement and trigger notification
  unlock(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement || achievement.unlocked) return;

    achievement.unlocked = true;
    this.saveAchievements();
    this.triggerNotification(achievement);
  }

  // Register a callback for achievement notifications
  onNotification(callback) {
    this.notificationCallbacks.push(callback);
  }

  // Trigger notification callbacks
  triggerNotification(achievement) {
    this.notificationCallbacks.forEach((callback) => callback(achievement));
  }

  // Get all achievements
  getAllAchievements() {
    return Object.values(this.achievements);
  }

  // Get unlocked achievements
  getUnlockedAchievements() {
    return this.getAllAchievements().filter((a) => a.unlocked);
  }

  // Get locked achievements
  getLockedAchievements() {
    return this.getAllAchievements().filter((a) => !a.unlocked);
  }

  // Reset all achievements (for debug mode)
  resetAll() {
    Object.keys(this.achievements).forEach((key) => {
      this.achievements[key].unlocked = false;
    });
    this.saveAchievements();
  }

  // Achievement check functions - called from game logic
  checkIdiot(score) {
    if (score === 0 && !this.isUnlocked('idiot')) {
      this.unlock('idiot');
    }
  }

  checkBombDeaths(lastDeathWasBomb, consecutiveBombDeaths) {
    if (lastDeathWasBomb && consecutiveBombDeaths >= 3 && !this.isUnlocked('demolitionist')) {
      this.unlock('demolitionist');
    }
  }

  checkNoDamageAchievements(score, damageTaken) {
    if (!damageTaken) {
      // Kinda Crazy: Reach 500 score without taking damage
      if (score >= 500 && !this.isUnlocked('kindaCrazy')) {
        this.unlock('kindaCrazy');
      }

      // Touch Grass: Reach 1000 score without taking damage
      if (score >= 1000 && !this.isUnlocked('touchGrass')) {
        this.unlock('touchGrass');
      }
    }
  }

  checkNoLife(score) {
    // No Life: Reach 10000 score (no damage requirement)
    if (score >= 10000 && !this.isUnlocked('noLife')) {
      this.unlock('noLife');
    }
  }

  checkLovesCardio(health) {
    // Loves Cardio: Hit a balance of 10 hearts in any game
    if (health >= 10 && !this.isUnlocked('lovesCardio')) {
      this.unlock('lovesCardio');
    }
  }

  checkUncleScrooge(coinsCollected) {
    // Uncle Scrooge: Collect 25 coins in one game
    if (coinsCollected >= 25 && !this.isUnlocked('uncleScrooge')) {
      this.unlock('uncleScrooge');
    }
  }
}
