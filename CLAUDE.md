# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a 2D vertical sidescroller motorcycle game (titled "ROAD RAGE") built with vanilla JavaScript and HTML5 Canvas. The game features dynamic difficulty scaling, powerups, audio, high score tracking, visual polish, a **multi-world system** with 2 playable worlds (Highway and Desert), 6 unlockable vehicles (3 per world), and a comprehensive vehicle modification system with 18 unique mods (3 per vehicle) that provide gameplay enhancements. The game runs entirely in the browser with no build process or dependencies.

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

- **Background music**: World-specific music that changes per world
  - Highway: `the-return-of-the-8-bit-era-301292.mp3`
  - Desert: `desert-world-bg-music.mp3`
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
- **Obstacles**: World-themed obstacle styles
  - Highway: Red crates with dark red borders
  - Desert: Green cacti with arms and spines
- **Background**: World-specific background images (`updateWorldBackground()`)
  - Highway: `highway-bg.png`
  - Desert: `desert-bg.png`
- **Powerups**: Detailed rendering with transparency, borders, and shine effects
- **Shield Effect**: Translucent blue bubble with shimmer around motorcycle
- **Game Over Screen**: Animated GIF (cat-scream.gif) with dark overlay
- **Banana Cheerer**: Fixed position GIF (banana-cheerer.gif) at bottom-left (style.css:30-41)
- **Vehicle Animations**:
  - Monster Truck: Animated exhaust flames shooting from side pipes
  - Ornithopter: Animated wing flutter effect
- **Particle Effects**: World-specific dust/sand trails behind vehicles
  - Highway: Gray road dust particles
  - Desert: Tan sand particles with sideways drift
  - Particle intensity increases when boosting

### World System (game.js:222-355)

The game features a multi-world system with themed environments:

#### World Definitions (`WORLDS` object)
- **9 worlds defined** (2 playable, 7 coming soon)
- Each world has: name, icon, description, unlock requirement, theme configuration, and vehicle list
- **World unlock**: Score 10,000 in the previous world to unlock the next
- **World themes** include: background image, music track, and obstacle style

#### Playable Worlds

1. **Highway** (World 1, unlocked by default)
   - Classic road experience
   - Background: `highway-bg.png`
   - Music: `the-return-of-the-8-bit-era-301292.mp3`
   - Obstacles: Red crates

2. **Desert** (World 2, requires 10,000 score in Highway)
   - Scorching sands theme (Dune-inspired)
   - Background: `desert-bg.png`
   - Music: `desert-world-bg-music.mp3`
   - Obstacles: Green cacti

#### World Functions
- `isWorldUnlocked(worldId)`: Check if world is accessible
- `getWorldKey(worldId)`: Convert ID to key (e.g., 1 -> "highway")
- `getWorldVehicles(worldId)`: Get vehicles available in a world
- `updateWorldBackground()`: Apply world's background image to page
- `loadWorldMusic(worldId)`: Switch to world's music track

### Vehicle System (game.js:537-850)

The game features **6 unlockable vehicles** across 2 worlds, with world-specific vehicle definitions in `WORLD_VEHICLES`:

#### Highway Vehicles

1. **Motorcycle** (Free, default)
   - Balanced beginner-friendly vehicle
   - Blue triangle with orange rider

2. **Sports Car** (150 coins)
   - Speed and risk-reward focused
   - Red sleek body with spoiler

3. **Monster Truck** (300 coins)
   - Maximum durability and survivability
   - Orange/yellow with huge wheels

#### Desert Vehicles (Dune-themed)

1. **Jeep** (Free when Desert unlocked)
   - Balanced desert exploration vehicle
   - Tan/khaki with roll cage

2. **Sandworm** (200 coins)
   - Speed-focused desert creature
   - Purple segmented body (Shai-Hulud inspired)

3. **Ornithopter** (400 coins)
   - Maximum durability flying craft
   - Dragonfly-wing aircraft design

**Vehicle Storage**: World-aware format in localStorage (`motorcycleUnlockedVehicles`)
- Format: `{ highway: ["motorcycle", ...], desert: ["jeep", ...] }`
- First vehicle of each world is free when that world is unlocked
**Vehicle Selection**: Dynamic carousel that rebuilds when switching worlds (`buildVehicleCarousel()`)

### Modification System (game.js:857-1030)

Each vehicle has 3 unique mods that enhance gameplay. All **18 mods** are fully implemented and affect gameplay. Mods are defined per-world in `WORLD_VEHICLE_MODS`.

#### Highway Mods

**Motorcycle Mods (Beginner-Friendly/Balanced)**

1. **Shield Start** (15 coins, `startWithShield`)
   - Start each life with an active shield

2. **Heart Boost** (30 coins, `heartSpawnBoost`)
   - Hearts spawn 50% more frequently

3. **Second Chance** (60 coins, `survivalChance20`)
   - 20% chance to survive any fatal hit

**Sports Car Mods (Speed/Risk-Reward)**

1. **Turbo Boost** (40 coins, `boostSpeed25`)
   - 50% faster boost speed

2. **Double Money** (75 coins, `coinValue2x`)
   - Coins are worth 2x value

3. **Score Master** (150 coins, `scoreMultiplier1_5x`)
   - Score multiplier 1.5x

**Monster Truck Mods (Tank/Durability)**

1. **Time Lord** (75 coins, `maxHealth5`)
   - Start with 5 hearts instead of 3

2. **Reinforced Shield** (150 coins, `shieldDoubleHit`)
   - Shields protect against 2 hits

3. **Tank Mode** (300 coins, `survivalChance35`)
   - 35% chance to survive any fatal hit

#### Desert Mods (Dune-themed names, same effects)

**Jeep Mods**

1. **Desert Shield** (20 coins, `startWithShield`)
2. **Oasis Finder** (35 coins, `heartSpawnBoost`)
3. **Desert Survival** (55 coins, `survivalChance20`)

**Sandworm Mods**

1. **Spice Boost** (45 coins, `boostSpeed25`)
2. **Spice Mining** (80 coins, `coinValue2x`)
3. **Prescience** (160 coins, `scoreMultiplier1_5x`)

**Ornithopter Mods**

1. **Reinforced Hull** (80 coins, `maxHealth5`)
2. **Shield Generator** (160 coins, `shieldDoubleHit`)
3. **Suspensor Field** (320 coins, `survivalChance35`)

**Mod Storage**: World-aware format in localStorage (`motorcycleUnlockedMods`)
- Format: `{ highway: { motorcycle: [], car: [], truck: [] }, desert: { jeep: [], sandworm: [], ornithopter: [] } }`
**Mod Logic**:
- `hasModEffect(effectName)` checks if current vehicle has mod unlocked
- `getModEffectValue(effectName, defaultValue)` returns multiplier values
- Effects applied in spawn functions, collision detection, scoring, and game initialization

## File Structure

- [index.html](index.html): HTML structure, menu screens, world map, mod screen, canvas, UI elements, audio elements
- [game.js](game.js): All game logic (3200+ lines) - world system, vehicle system, mod system, collision detection, rendering
- [style.css](style.css): Styling for game container, menu screens, world map, mod screen, UI, and overlays
- [CLAUDE.md](CLAUDE.md): This file - architecture documentation
- [README_TODO.md](README_TODO.md): Development TODO list and feature ideas
- [CONTRIBUTING.md](CONTRIBUTING.md): Git workflow and contribution guidelines
- **scripts/** folder: Testing utilities
  - `give_coins.html`: Add coins for testing
  - `reset_coins.html`: Reset coins to 0
  - `lock_vehicles.html`: Lock all vehicles and reset mods (world-aware)
- **Assets** (in media/ folder):
  - **images/**: World background images
    - `highway-bg.png`: Highway world background
    - `desert-bg.png`: Desert world background
  - **sounds/**: Audio files
    - `the-return-of-the-8-bit-era-301292.mp3`: Highway background music
    - `desert-world-bg-music.mp3`: Desert background music
    - Sound effects for collisions, powerups, milestones, game over
  - `cat-scream.gif`: Game over screen animation
  - `banana-cheerer.gif`: Decorative cheering banana

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
  - World high scores (`motorcycleWorldHighScores`) - per-world format: `{ "1": 5000, "2": 3000 }`
  - Total coins (`motorcycleTotalCoins`)
  - Unlocked vehicles (`motorcycleUnlockedVehicles`) - world-aware format
  - Unlocked mods per vehicle (`motorcycleUnlockedMods`) - world-aware format
  - Unlocked achievements (`motorcycleUnlockedAchievements`)
- Automatic data migration: Old localStorage format migrates to world-aware format on load
- 60 FPS target via `requestAnimationFrame()`
- Mobile support: Limited (keyboard controls only, could add touch events)
- Browser compatibility: Modern browsers only (ES6+ features used)
- Testing utilities in `scripts/` folder for rapid development/testing
