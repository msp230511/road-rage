// Audio Manager - Centralized audio control
import { GAME_CONFIG } from './config.js';

export class AudioManager {
  constructor() {
    this.isMuted = false;
    this.sounds = {};
    this.gameOverSounds = [];
    this.initializeAudioElements();
  }

  initializeAudioElements() {
    // Background music
    this.bgMusic = document.getElementById('bgMusic');
    if (this.bgMusic) {
      this.bgMusic.volume = GAME_CONFIG.MUSIC_VOLUME;
    }

    // Sound effects
    this.sounds = {
      coin: document.getElementById('coinSound'),
      explosion: document.getElementById('explosionSound'),
      hitmarker: document.getElementById('hitmarkerSound'),
      bubble: document.getElementById('bubbleSound'),
      pauseMenu: document.getElementById('pauseMenuSound'),
      heroesNeverDie: document.getElementById('heroesNeverDieSound'),
      heartPickup: document.getElementById('heartPickupSound'),
      milestone1000: document.getElementById('milestone1000Sound'),
      milestone2000: document.getElementById('milestone2000Sound'),
      milestone3000: document.getElementById('milestone3000Sound'),
    };

    // Game over sounds array
    this.gameOverSounds = [
      document.getElementById('gameOverSound1'),
      document.getElementById('gameOverSound2'),
      document.getElementById('gameOverSound4'),
      document.getElementById('gameOverSound5'),
      document.getElementById('gameOverSound6'),
      document.getElementById('gameOverSound7'),
      document.getElementById('gameOverSound8'),
      document.getElementById('gameOverSound9'),
    ];
  }

  // Background music control
  playMusic() {
    if (!this.isMuted && this.bgMusic) {
      this.bgMusic.play().catch((e) => console.log('Music play error:', e));
    }
  }

  pauseMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
  }

  restartMusic() {
    if (this.bgMusic) {
      this.bgMusic.currentTime = 0;
      this.playMusic();
    }
  }

  // Sound effects
  playSound(soundName) {
    if (this.isMuted) return;

    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((e) => console.log(`Sound ${soundName} error:`, e));
    }
  }

  playCoin() {
    this.playSound('coin');
  }

  playExplosion() {
    this.playSound('explosion');
  }

  playHitmarker() {
    this.playSound('hitmarker');
  }

  playBubble() {
    this.playSound('bubble');
  }

  playPauseMenu() {
    this.playSound('pauseMenu');
  }

  playHeroesNeverDie() {
    this.playSound('heroesNeverDie');
  }

  playHeartPickup() {
    this.playSound('heartPickup');
  }

  playMilestone(milestone) {
    const soundMap = {
      1000: 'milestone1000',
      2000: 'milestone2000',
      3000: 'milestone3000',
    };

    const soundName = soundMap[milestone];
    if (soundName) {
      this.playSound(soundName);
    }
  }

  playRandomGameOver() {
    if (this.isMuted) return;

    const randomSound = this.gameOverSounds[
      Math.floor(Math.random() * this.gameOverSounds.length)
    ];
    if (randomSound) {
      randomSound.currentTime = 0;
      randomSound.play().catch((e) => console.log('Game over sound error:', e));
    }
  }

  // Mute control
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.pauseMusic();
    }
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.pauseMusic();
    }
  }

  getMuted() {
    return this.isMuted;
  }
}
