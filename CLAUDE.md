# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a 2D vertical sidescroller motorcycle game (titled "ROAD RAGE") built with vanilla JavaScript and HTML5 Canvas. The game features dynamic difficulty scaling, powerups, audio, high score tracking, visual polish, a vehicle unlock system with 3 playable vehicles, and a comprehensive vehicle modification system with 9 unique mods that provide gameplay enhancements. The game runs entirely in the browser with no build process or dependencies.

## Running the Game

Simply open [index.html](index.html) in any modern web browser. No build step, server, or package installation required.

## Architecture

### Core Game Structure

The game follows a traditional game loop pattern in [game.js](game.js):

- **Game Loop**: `gameLoop()` (game.js:639-643) runs continuously via `requestAnimationFrame()`, calling `update()` then `render()` each frame
- **Game State**: Single `game` object (game.js:47-66) holds all state including health, score, high score, motorcycle position, obstacles array, powerups array, shield status, pause state, mute state, and boost state
- **Constants**: Key gameplay parameters defined at top (game.js:13-23):
  - `TILE_HEIGHT` (50px)
  - `TOTAL_TILES` (18 visible tiles)
  - `LANES` (3)
  - `LANE_WIDTH` (200px, calculated from canvas width)
  - Default difficulty: `DEFAULT_SCROLL_SPEED` (3), `DEFAULT_OBSTACLE_SPAWN_CHANCE` (0.02)
  - Powerup spawn rates: `SHIELD_SPAWN_CHANCE` (0.01), `BOMB_SPAWN_CHANCE` (0.01), `HEART_SPAWN_CHANCE` (0.002)

### Coordinate System

- **Lanes**: 3 horizontal lanes (0=left, 1=center, 2=right), each 200px wide on a 600px canvas
- **Tiles**: Vertical road divided into 50px tall tiles, with 18 tiles visible on the 900px canvas
- **Scrolling**: `game.scrollOffset` continuously increments to create illusion of forward motion (doubles when boosting)
- **Motorcycle Position**: Fixed at row 15 (from top), only changes lanes horizontally

### Game Mechanics

#### Difficulty Scaling
The game implements dynamic difficulty via `DIFFICULTY_CONFIG` (game.js:26-33):
- Score thresholds trigger speed and spawn rate increases
- 6 difficulty tiers: 0, 200, 500, 1000, 1500, 2000 points
- Speed ranges from 10 to 26, spawn chance from 0.1 to 0.45
- Updated every frame via `updateDifficulty()` (game.js:115-119)

#### Collision Detection
Occurs when obstacle/powerup lane matches motorcycle lane AND their y-positions overlap (game.js:258-291):
- **Obstacle collision**: Removes obstacle, decrements health (unless shield active)
- **Shield collision**: Consumes shield, removes obstacle, no damage
- **Powerup collection**: Triggers powerup effect and removes powerup

#### Health & Scoring
- **Health**: Starts at 3, displayed in UI, game over at 0
- **Scoring**: +10 points per obstacle that scrolls past bottom of screen (game.js:311)
- **High Score**: Persists to localStorage (game.js:36-44), displayed in top-left corner (game.js:358-361)

#### Powerup System (game.js:168-201, 453-568)
Four powerup types spawn randomly:
1. **Shield** (light blue bubble): Protects from one obstacle collision (can be upgraded to 2 hits with mods)
2. **Bomb** (black cannonball): Instant game over on contact (can be survived with survival chance mods)
3. **Heart** (red heart): Adds +1 health (spawn rate can be increased with mods)
4. **Coin** (yellow coin): Persistent currency for unlocking vehicles and mods

#### Boost Mechanic
- Hold W or Up Arrow to double speed (game.js:127-136, 231-233)
- Affects both scroll speed and obstacle movement
- Visual indicator: none (could be added)

#### Smart Obstacle Spawning
`getSafeLanes()` (game.js:204-221) prevents undodgeable scenarios:
- Checks for obstacles in "danger zone" (top 50px of screen)
- Blocks all spawning if any obstacle exists in danger zone
- Ensures minimum vertical spacing between obstacles

### Rendering Pipeline (game.js:328-362)

1. Clear canvas (dark gray background)
2. Draw road tiles with alternating colors (game.js:364-380)
3. Draw yellow dashed lane dividers (game.js:382-398)
4. Draw all obstacles (red crates with borders) (game.js:400-422)
5. Draw all powerups (shields, bombs, hearts) (game.js:453-568)
6. Draw motorcycle (blue triangle + orange rider + black wheels) (game.js:424-451)
7. Draw shield effect if active (bubble around motorcycle) (game.js:570-590)
8. Draw high score in top-left corner

### Input Handling

Keyboard events (game.js:122-136):
- **Left/Right Movement**: Arrow Keys or A/D to change lanes via `moveLane()`
- **Boost**: W or Up Arrow (hold) to activate boost mode
- Movement blocked when `game.isRunning` is false (game over state)

### UI Controls (index.html:15-18)

- **Pause Button**: Toggles `game.isPaused`, pauses music, shows ⏸️/▶️
- **Mute Button**: Toggles `game.isMuted`, controls background music, shows 🔊/🔇
- **Health/Score Display**: Updated in real-time via DOM manipulation

### Audio System

- **Background music**: `the-return-of-the-8-bit-era-301292.mp3` (loops, volume 50%)
- **Sound effects**:
  - Coin collection, explosions, hitmarkers, bubbles, pause menu
  - Milestone sounds at 1000, 2000, 3000 points
  - 6 random game over sounds
  - "Heroes Never Die" sound for survival chance mods
- Respects mute and pause states
- Requires user interaction for autoplay (browser requirement)

### Game Over & Restart (game.js:592-634)

- **Game Over**: Sets `game.isRunning = false`, displays overlay with cat-scream.gif, shows final score
- **Restart**: Resets game state while preserving high score and mute preference, restarts music

### Visual Polish

- **Road**: Alternating tile colors (#2c3e50, #34495e) scroll smoothly
- **Lane Dividers**: Yellow dashed lines that scroll
- **Obstacles**: Red crates with dark red borders
- **Powerups**: Detailed rendering with transparency, borders, and shine effects
- **Shield Effect**: Translucent blue bubble with shimmer around motorcycle
- **Game Over Screen**: Animated GIF (cat-scream.gif) with dark overlay
- **Banana Cheerer**: Fixed position GIF (banana-cheerer.gif) at bottom-left (style.css:30-41)

### Vehicle System (game.js:195-265)

The game features 3 unlockable vehicles with unique characteristics:

1. **Motorcycle** (Free, default)
   - Balanced beginner-friendly vehicle
   - 3 starting hearts
   - No special characteristics

2. **Sports Car** (50 coins)
   - Speed and risk-reward focused
   - 3 starting hearts
   - Access to boost speed and coin multiplier mods

3. **Monster Truck** (100 coins)
   - Maximum durability and survivability
   - 3 starting hearts (5 with mod)
   - Access to extra health and reinforced shield mods

**Vehicle Storage**: Unlocked vehicles persist in localStorage (`motorcycleUnlockedVehicles`)
**Vehicle Selection**: Menu screen with canvas previews, lock overlays, and unlock/modify buttons

### Modification System (game.js:195-355)

Each vehicle has 3 unique mods that enhance gameplay. All mods are **fully implemented** and affect gameplay.

#### Motorcycle Mods (Beginner-Friendly/Balanced)

1. **Shield Start** (25 coins, `startWithShield`)
   - Start each life with an active shield
   - Applied at game start/restart

2. **Heart Boost** (40 coins, `heartSpawnBoost`)
   - Hearts spawn 50% more frequently
   - Multiplies HEART_SPAWN_CHANCE by 1.5

3. **Second Chance** (60 coins, `survivalChance20`)
   - 20% chance to survive any fatal hit
   - Checks on fatal damage from obstacles or bombs
   - Plays "Heroes Never Die" sound on survival

#### Sports Car Mods (Speed/Risk-Reward)

1. **Turbo Boost** (30 coins, `boostSpeed25`)
   - 50% faster boost speed
   - Multiplies boost speed by 1.5 (normal boost is 2x, becomes 3x)

2. **Double Money** (50 coins, `coinValue2x`)
   - Coins are worth 2x value
   - Each coin collected gives 2 coins instead of 1

3. **Score Master** (75 coins, `scoreMultiplier1_5x`)
   - Score multiplier 1.5x
   - Each avoided obstacle gives 15 points instead of 10

#### Monster Truck Mods (Tank/Durability)

1. **Time Lord** (40 coins, `maxHealth5`)
   - Start with 5 hearts instead of 3
   - +2 extra hearts at game start/restart

2. **Reinforced Shield** (65 coins, `shieldDoubleHit`)
   - Shields protect against 2 hits instead of 1
   - Shield persists after first hit, breaks on second

3. **Tank Mode** (100 coins, `survivalChance35`)
   - 35% chance to survive any fatal hit
   - Checks on fatal damage from obstacles or bombs
   - Plays "Heroes Never Die" sound on survival

**Mod Storage**: Unlocked mods persist per-vehicle in localStorage (`motorcycleUnlockedMods`)
**Mod Logic**:
- `hasModEffect(effectName)` checks if current vehicle has mod unlocked
- `getModEffectValue(effectName, defaultValue)` returns multiplier values
- Effects applied in spawn functions, collision detection, scoring, and game initialization

## File Structure

- [index.html](index.html): HTML structure, menu screens, mod screen, canvas, UI elements, 18 audio elements
- [game.js](game.js): All game logic (1084+ lines) - vehicle system, mod system, collision detection, rendering
- [style.css](style.css): Styling for game container, menu screens, mod screen, UI, and overlays
- [CLAUDE.md](CLAUDE.md): This file - architecture documentation
- [README_TODO.md](README_TODO.md): Development TODO list and feature ideas
- [CONTRIBUTING.md](CONTRIBUTING.md): Git workflow and contribution guidelines
- **scripts/** folder: Testing utilities
  - `give_coins.html`: Add coins for testing
  - `reset_coins.html`: Reset coins to 0
  - `lock_vehicles.html`: Lock all vehicles and reset mods
- **Assets** (in media/ folder):
  - `cat-scream.gif`: Game over screen animation
  - `banana-cheerer.gif`: Decorative cheering banana
  - `the-return-of-the-8-bit-era-301292.mp3`: Background music
  - Sound effects for collisions, powerups, milestones, game over

## Modifying Game Parameters

### Difficulty Tuning
- **Difficulty Curve**: Edit `DIFFICULTY_CONFIG` (game.js:26-33) - adjust score thresholds, speed, and spawn rates
- **Default Difficulty**: Change `DEFAULT_SCROLL_SPEED` (game.js:19) or `DEFAULT_OBSTACLE_SPAWN_CHANCE` (game.js:20)
- **Lives**: Modify initial `health: 3` in game state (game.js:48)

### Powerup Tuning
- **Spawn Rates**: Adjust `SHIELD_SPAWN_CHANCE`, `BOMB_SPAWN_CHANCE`, `HEART_SPAWN_CHANCE` (game.js:21-23)
- **Shield Duration**: Currently one-hit (boolean flag), modify `game.hasShield` logic for timed shields

### Visual Tuning
- **Canvas Size**: Update dimensions in [index.html:20](index.html#L20) - affects lane calculations
- **Colors**: Modify color strings in render functions (game.js:364-590)
- **Motorcycle/Obstacle Sizes**: Adjust multipliers in draw functions (e.g., `LANE_WIDTH * 0.3`)

### Safe Spawning Tuning
- **Danger Zone**: Change `DANGER_ZONE_HEIGHT` in `getSafeLanes()` (game.js:207) to make spawning more/less lenient

## Development Notes

- Pure vanilla JavaScript - no frameworks, no dependencies
- All state in single `game` object for easy debugging and potential serialization
- Persistence via `localStorage` API:
  - High scores (`motorcycleHighScore`)
  - Total coins (`motorcycleTotalCoins`)
  - Unlocked vehicles (`motorcycleUnlockedVehicles`)
  - Unlocked mods per vehicle (`motorcycleUnlockedMods`)
- 60 FPS target via `requestAnimationFrame()`
- Mobile support: Limited (keyboard controls only, could add touch events)
- Browser compatibility: Modern browsers only (ES6+ features used)
- Testing utilities in `scripts/` folder for rapid development/testing
