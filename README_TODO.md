# Motorcycle Sidescroller - TODO List

## Current Status

The game is in a fully playable state with all core mechanics, powerups, difficulty scaling, polish features, vehicle unlocking system, and **fully functional vehicle modification system** implemented. All 9 mods (3 per vehicle) have active gameplay effects. Players can unlock vehicles with coins, purchase mods, and experience meaningful gameplay changes.

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
- [x] **All 9 mod gameplay effects fully implemented and working**
- [x] Coin collection system (persistent currency)
- [x] Sound effect system (18 audio files including milestones and survival sounds)

## Known Issues

- None currently

## Future Enhancements (Ideas)

### Gameplay

- [x] ~~**Implement mod gameplay effects**~~ (COMPLETED - all 9 mods fully functional)
- [ ] Multiple difficulty modes (Easy/Normal/Hard)
- [ ] Different obstacle types (cones, barrels, cars)
- [ ] More powerup types:
  - [ ] Temporary invincibility star
  - [ ] Speed boost powerup (separate from W key)
  - [ ] Score multiplier (could be mod effect)
- [ ] Combo system (rewards for consecutive dodges)
- [ ] Achievement system
- [ ] Different road environments (desert, city, highway)
- [ ] Weather effects (rain, fog)
- [ ] Lane expansion (5 lanes at higher scores)

### UI/UX

- [ ] Start menu/title screen
- [ ] Settings menu (volume control, key bindings)
- [ ] Tutorial/instructions screen
- [ ] Animated transitions between screens
- [ ] Particle effects (explosions, sparks)
- [ ] Better mobile support (touch controls)
- [ ] Responsive canvas sizing

### Audio

- [ ] Sound effects (collision, powerup pickup, boost)
- [ ] Multiple music tracks
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
2. Additional sound effects (boost activation, shield break, etc.)
3. Mobile touch controls for broader accessibility
4. Visual mod indicators (show which mods are active during gameplay)

## Vehicle Modification System

### Current Implementation ✅ FULLY FUNCTIONAL

- **3 vehicles**: Motorcycle (free), Sports Car (50 coins), Monster Truck (100 coins)
- **9 total mods**: 3 unique mods per vehicle, each with gameplay effects
- **localStorage persistence**: Separate unlock state per vehicle
- **Modification screen**: Accessible via MODIFY button on each unlocked vehicle
- **Lock/unlock UI**: Visual feedback for locked/unlocked mods
- **All mod effects implemented**: Survival chances, spawn rates, multipliers, starting bonuses

### Implemented Mods (Current State)

#### Mod Categories

1. **Survival/Defense**: Shield-based and damage mitigation
2. **Health/Recovery**: Max health increases and healing
3. **Coin/Economy**: Coin value multipliers and spawn rates
4. **Speed/Mobility**: Boost and lane switching enhancements
5. **Powerup**: Powerup spawn rates and effectiveness
6. **Obstacle**: Obstacle spawn rates and hitbox sizes
7. **Scoring**: Score multipliers

#### Vehicle-Specific Mod Themes

**Motorcycle (Beginner-Friendly/Balanced)** ✅

- Theme: Defense and survival for learning the game
- Mod 1 (25 coins): **Shield Start** - Start each life with a shield ✅
- Mod 2 (40 coins): **Heart Boost** - Hearts spawn 50% more frequently ✅
- Mod 3 (60 coins): **Second Chance** - 20% chance to survive fatal hit ✅

**Sports Car (Speed/Risk-Reward)** ✅

- Theme: Speed and earning potential
- Mod 1 (30 coins): **Turbo Boost** - 50% faster boost speed ✅
- Mod 2 (50 coins): **Double Money** - Coins worth 2x ✅
- Mod 3 (75 coins): **Score Master** - Score multiplier 1.5x ✅

**Monster Truck (Tank/Durability)** ✅

- Theme: Maximum survivability and durability
- Mod 1 (40 coins): **Time Lord** - Start with 5 hearts instead of 3 ✅
- Mod 2 (65 coins): **Reinforced Shield** - Shields protect against 2 hits ✅
- Mod 3 (100 coins): **Tank Mode** - 35% chance to survive fatal hit ✅

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

- Check `isModUnlocked(vehicleType, modId)` during gameplay
- Apply effects in relevant game logic:
  - Survival chances → collision detection
  - Spawn rates → spawn chance constants
  - Score/coin multipliers → reward calculations
  - Starting bonuses → startGame() function
- Current VEHICLE_MODS config: `game.js:194-211`
- Mod management functions: `game.js:240-274`
- Mod UI: `index.html:64-134`, `style.css:268-402`

## Notes

- Game currently runs at 60 FPS via requestAnimationFrame
- All game state in single `game` object for easy serialization
- No dependencies or build process - pure vanilla JS
- Difficulty thresholds defined in DIFFICULTY_CONFIG (game.js:26-33)
- Vehicle prices: Motorcycle (0), Car (50), Truck (100)
- Mod prices range from 25-100 coins depending on vehicle and tier
- Testing utilities in `scripts/` folder (give coins, reset coins, lock vehicles)
