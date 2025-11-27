# Motorcycle Sidescroller - TODO List

## Current Status
The game is in a solid playable state with core mechanics, powerups, difficulty scaling, and polish features implemented.

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
- [x] Boost mechanic (hold W/Up Arrow to double speed)
- [x] Pause/unpause functionality
- [x] Mute/unmute audio controls
- [x] Background music with autoplay handling
- [x] Game over screen with animated GIF
- [x] Banana cheerer GIF (fixed position, bottom left)
- [x] High score tracking (localStorage persistence)
- [x] Smart obstacle spawning (prevents undodgeable scenarios)
- [x] Visual polish (road tiles, lane dividers, shield effects)

## Known Issues
- None currently

## Future Enhancements (Ideas)

### Gameplay
- [ ] Multiple difficulty modes (Easy/Normal/Hard)
- [ ] Different obstacle types (cones, barrels, cars)
- [ ] More powerup types:
  - [ ] Temporary invincibility star
  - [ ] Speed boost powerup (separate from W key)
  - [ ] Score multiplier
  - [ ] Coin/token collectibles
- [ ] Combo system (rewards for consecutive dodges)
- [ ] Achievement system
- [ ] Different road environments (desert, city, highway)
- [ ] Weather effects (rain, fog)

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
1. Start menu/title screen - the game currently starts immediately
2. Sound effects for collisions and powerups
3. Mobile touch controls for broader accessibility

## Notes
- Game currently runs at 60 FPS via requestAnimationFrame
- All game state is in single `game` object for easy serialization
- No dependencies or build process - pure vanilla JS
- Difficulty thresholds defined in DIFFICULTY_CONFIG (game.js:26-33)
