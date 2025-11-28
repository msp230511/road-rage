// Input Handler - Keyboard and game controls
export class InputHandler {
  constructor() {
    this.keys = new Set();
    this.pendingMovement = 0; // Movement to process (only triggers once per keypress)
    this.setupListeners();
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e) {
    const key = e.key.toLowerCase();

    // Only trigger movement on initial keypress, not repeat
    if (!this.keys.has(key)) {
      this.keys.add(key);

      // Set pending movement for lane changes (one-shot)
      if (key === 'a' || key === 'arrowleft') {
        this.pendingMovement = -1;
      } else if (key === 'd' || key === 'arrowright') {
        this.pendingMovement = 1;
      }
    }
  }

  handleKeyUp(e) {
    this.keys.delete(e.key.toLowerCase());
  }

  isKeyPressed(key) {
    return this.keys.has(key.toLowerCase());
  }

  // Check for boost input (continuous - held down)
  isBoosting() {
    return this.isKeyPressed('w') || this.isKeyPressed('arrowup');
  }

  // Check for lane movement (one-shot - only triggers once per keypress)
  getMovement() {
    const movement = this.pendingMovement;
    this.pendingMovement = 0; // Consume the movement
    return movement;
  }

  // Debug mode check (A+W+D)
  isDebugModeActive() {
    return (
      this.isKeyPressed('a') &&
      this.isKeyPressed('w') &&
      this.isKeyPressed('d')
    );
  }

  getKeysPressed() {
    return this.keys;
  }
}
