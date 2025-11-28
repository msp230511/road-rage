// LocalStorage utility module
import { STORAGE_KEYS } from './config.js';

export const Storage = {
  // High Score
  loadHighScore() {
    const saved = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return saved ? parseInt(saved, 10) : 0;
  },

  saveHighScore(score) {
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
  },

  // Total Coins
  loadTotalCoins() {
    const saved = localStorage.getItem(STORAGE_KEYS.TOTAL_COINS);
    return saved ? parseInt(saved, 10) : 0;
  },

  saveTotalCoins(coins) {
    localStorage.setItem(STORAGE_KEYS.TOTAL_COINS, coins.toString());
  },

  // Unlocked Vehicles
  loadUnlockedVehicles() {
    const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKED_VEHICLES);
    return saved ? JSON.parse(saved) : ['motorcycle']; // Motorcycle unlocked by default
  },

  saveUnlockedVehicles(unlockedVehicles) {
    localStorage.setItem(
      STORAGE_KEYS.UNLOCKED_VEHICLES,
      JSON.stringify(unlockedVehicles)
    );
  },

  // Unlocked Mods
  loadUnlockedMods() {
    const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKED_MODS);
    return saved
      ? JSON.parse(saved)
      : {
          motorcycle: [],
          car: [],
          truck: [],
        };
  },

  saveUnlockedMods(unlockedMods) {
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_MODS, JSON.stringify(unlockedMods));
  },

  // Achievements
  loadAchievements() {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return saved ? JSON.parse(saved) : null;
  },

  saveAchievements(achievements) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },

  // Reset functions for debug mode
  resetCoins() {
    this.saveTotalCoins(0);
  },

  resetVehiclesAndMods() {
    this.saveUnlockedVehicles(['motorcycle']);
    this.saveUnlockedMods({
      motorcycle: [],
      car: [],
      truck: [],
    });
  },

  resetAchievements() {
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  },
};
