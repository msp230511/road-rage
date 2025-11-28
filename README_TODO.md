# Motorcycle Sidescroller - TODO List

## Current Status

The game is in a fully playable state with all core mechanics, powerups, difficulty scaling, polish features, **multi-world system**, vehicle unlocking system, and **fully functional vehicle modification system** implemented. Two worlds are playable (Highway and Desert) with 6 vehicles total (3 per world) and 18 mods (3 per vehicle). Players can unlock worlds by scoring 10,000 points, unlock vehicles with coins, purchase mods, and experience meaningful gameplay changes.

## Completed Features

- [x] Core game loop and rendering
- [x] 3-lane motorcycle movement (Arrow Keys / A/D/W)
- [x] Obstacle spawning and collision detection
- [x] Health system (3 lives)
- [x] Scoring system (+10 per avoided obstacle)
- [x] Dynamic difficulty scaling (speed and spawn rate increase with score)
- [x] Shield powerup (protects from one hit)
- [x] Bomb powerup (instant game over)
- [x] Heart powerup (adds health)
- [x] Coin collectibles (persistent balance)
- [x] Boost mechanic (hold W/Up Arrow to double speed)
- [x] Pause/unpause functionality
- [x] Mute/unmute audio controls
- [x] Background music with autoplay handling
- [x] Game over screen with animated GIF
- [x] Banana cheerer GIF (fixed position, bottom left)
- [x] High score tracking (localStorage persistence)
- [x] Smart obstacle spawning (prevents undodgeable scenarios)
- [x] Visual polish (road tiles, lane dividers, shield effects)
- [x] Menu screen with vehicle selection
- [x] Multiple playable vehicles (motorcycle, sports car, monster truck)
- [x] Vehicle unlock system with coin prices
- [x] Vehicle-specific characteristics and rendering
- [x] Vehicle modification screen
- [x] Mod unlock system (3 mods per vehicle)
- [x] Per-vehicle mod state management (localStorage)
- [x] Modification UI with lock icons and pricing
- [x] **All 18 mod gameplay effects fully implemented and working** (9 Highway + 9 Desert)
- [x] Coin collection system (persistent currency)
- [x] Sound effect system (18 audio files including milestones and survival sounds)
- [x] **Multi-world system with world map UI**
- [x] **Desert World (World 2) fully implemented**
  - Desert-themed background image
  - Desert-specific background music
  - Cactus obstacles (replaces crates)
  - 3 Dune-themed vehicles (Jeep, Sandworm, Ornithopter)
  - 9 Dune-themed mods with unique names
  - World unlock system (score 10,000 in previous world)
- [x] Per-world high score tracking
- [x] World-aware vehicle and mod storage (localStorage migration)

## Known Issues

- None currently

## Future Enhancements (Ideas)

### Gameplay

- [x] ~~**Implement mod gameplay effects**~~ (COMPLETED - all 18 mods fully functional)
- [x] ~~Different road environments~~ (Highway and Desert implemented!)
- [x] ~~Different obstacle types~~ (Crates in Highway, Cacti in Desert)
- [ ] Multiple difficulty modes (Easy/Normal/Hard)
- [ ] More powerup types:
  - [ ] Temporary invincibility star
  - [ ] Speed boost powerup (separate from W key)
  - [ ] Score multiplier (could be mod effect)
- [ ] Combo system (rewards for consecutive dodges)
- [ ] Achievement system (framework exists, needs more achievements)
- [ ] Weather effects (rain, fog)
- [ ] Lane expansion (5 lanes at higher scores)
- [ ] Remaining 7 worlds (Forest, Beach, Mountain, City, Arctic, Volcano, Space)

### UI/UX

- [ ] Start menu/title screen
- [ ] Settings menu (volume control, key bindings)
- [ ] Tutorial/instructions screen
- [ ] Animated transitions between screens
- [ ] Particle effects (explosions, sparks)
- [ ] Better mobile support (touch controls)
- [ ] Responsive canvas sizing

### Audio

- [x] ~~Sound effects~~ (collision, powerup pickup, etc. implemented)
- [x] ~~Multiple music tracks~~ (Highway and Desert have different music)
- [ ] Volume sliders (music and SFX separate)

### Technical

- [ ] Leaderboard (online or local)
- [ ] Save game state
- [ ] Performance optimizations for lower-end devices
- [ ] Add build process for minification
- [ ] Add analytics/telemetry

### Polish

- [ ] Better motorcycle sprite/animation
- [ ] Better obstacle sprites
- [ ] Background scenery (trees, buildings)
- [ ] Screen shake on collision
- [ ] Speed lines effect during boost
- [ ] Better heart powerup rendering

## Next Priority Tasks

1. ~~**Implement mod gameplay effects**~~ ✅ COMPLETED
2. ~~**Desert World expansion**~~ ✅ COMPLETED
3. Additional sound effects (boost activation, shield break, etc.)
4. Mobile touch controls for broader accessibility
5. Visual mod indicators (show which mods are active during gameplay)
6. Implement remaining worlds (Forest, Beach, Mountain, City, Arctic, Volcano, Space)

## Vehicle Modification System

### Current Implementation ✅ FULLY FUNCTIONAL

- **6 vehicles across 2 worlds**:
  - Highway: Motorcycle (free), Sports Car (150 coins), Monster Truck (300 coins)
  - Desert: Jeep (free when world unlocked), Sandworm (200 coins), Ornithopter (400 coins)
- **18 total mods**: 3 unique mods per vehicle, each with gameplay effects
- **World-aware localStorage persistence**: Separate unlock state per world and vehicle
- **Modification screen**: Accessible via MODIFY button on each unlocked vehicle
- **Lock/unlock UI**: Visual feedback for locked/unlocked mods
- **All mod effects implemented**: Survival chances, spawn rates, multipliers, starting bonuses

### World System ✅ NEW

- **9 worlds defined** (2 playable: Highway, Desert)
- **World unlock**: Score 10,000 in previous world
- **World themes**: Custom backgrounds, music, and obstacle styles
- **World map UI**: Navigate between worlds, see high scores and unlock status
- **Per-world high scores**: Track best scores for each world separately

### Implemented Mods (Current State)

#### Mod Categories

1. **Survival/Defense**: Shield-based and damage mitigation (startWithShield, survivalChance)
2. **Health/Recovery**: Max health increases (maxHealth5)
3. **Coin/Economy**: Coin value multipliers (coinValue2x)
4. **Speed/Mobility**: Boost enhancements (boostSpeed25)
5. **Powerup**: Powerup spawn rates (heartSpawnBoost)
6. **Shield**: Shield durability (shieldDoubleHit)
7. **Scoring**: Score multipliers (scoreMultiplier1_5x)

#### Highway Vehicle Mods

**Motorcycle (Beginner-Friendly/Balanced)** ✅
- Mod 1 (15 coins): **Shield Start** - Start each life with a shield
- Mod 2 (30 coins): **Heart Boost** - Hearts spawn 50% more frequently
- Mod 3 (60 coins): **Second Chance** - 20% chance to survive fatal hit

**Sports Car (Speed/Risk-Reward)** ✅
- Mod 1 (40 coins): **Turbo Boost** - 50% faster boost speed
- Mod 2 (75 coins): **Double Money** - Coins worth 2x
- Mod 3 (150 coins): **Score Master** - Score multiplier 1.5x

**Monster Truck (Tank/Durability)** ✅
- Mod 1 (75 coins): **Time Lord** - Start with 5 hearts instead of 3
- Mod 2 (150 coins): **Reinforced Shield** - Shields protect against 2 hits
- Mod 3 (300 coins): **Tank Mode** - 35% chance to survive fatal hit

#### Desert Vehicle Mods (Dune-themed) ✅ NEW

**Jeep (Beginner-Friendly/Balanced)** ✅
- Mod 1 (20 coins): **Desert Shield** - Start with a protective sandstorm barrier
- Mod 2 (35 coins): **Oasis Finder** - Hearts spawn 50% more frequently
- Mod 3 (55 coins): **Desert Survival** - 20% chance to survive fatal hit

**Sandworm (Speed/Risk-Reward)** ✅
- Mod 1 (45 coins): **Spice Boost** - 50% faster boost speed
- Mod 2 (80 coins): **Spice Mining** - Coins worth 2x
- Mod 3 (160 coins): **Prescience** - Score multiplier 1.5x

**Ornithopter (Tank/Durability)** ✅
- Mod 1 (80 coins): **Reinforced Hull** - Start with 5 hearts instead of 3
- Mod 2 (160 coins): **Shield Generator** - Shields protect against 2 hits
- Mod 3 (320 coins): **Suspensor Field** - 35% chance to survive fatal hit

#### Additional Mod Ideas (Future)

- Magnetic coin collection (auto-collect nearby coins)
- 25% chance to gain heart instead of dying on bomb
- Invincibility for first 3 seconds of each life
- Shield automatically regenerates every 30 seconds
- Obstacles move 10% slower
- 30% smaller hitbox on vehicle
- Permanent speed boost available
- Powerups have larger pickup radius
- Heal 1 heart every 1000 points

### Implementation Notes

- Check `isModUnlocked(vehicleType, modId)` during gameplay (world-aware)
- Apply effects in relevant game logic:
  - Survival chances → collision detection
  - Spawn rates → spawn chance constants
  - Score/coin multipliers → reward calculations
  - Starting bonuses → startGame() function
- World-based config: `WORLD_VEHICLE_MODS` object (game.js:857-1030)
- Legacy compatibility: `VEHICLE_MODS` object references `WORLD_VEHICLE_MODS`
- Mod management functions: `isModUnlocked()`, `unlockMod()`, `getVehicleMods()`

## Notes

- Game currently runs at 60 FPS via requestAnimationFrame
- All game state in single `game` object for easy serialization
- No dependencies or build process - pure vanilla JS
- Difficulty thresholds defined in DIFFICULTY_CONFIG (game.js:513-536)
- Vehicle prices vary by world:
  - Highway: Motorcycle (0), Sports Car (150), Monster Truck (300)
  - Desert: Jeep (0 when world unlocked), Sandworm (200), Ornithopter (400)
- Mod prices range from 15-320 coins depending on vehicle and tier
- World unlock requirement: 10,000 score in previous world
- Testing utilities in `scripts/` folder (give coins, reset coins, lock vehicles - all world-aware)
