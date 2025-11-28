// Renderer - All drawing functions
import { GAME_CONFIG } from './config.js';

export class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  // Clear canvas
  clear() {
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Draw road tiles
  drawRoad(scrollOffset) {
    const offset = scrollOffset % GAME_CONFIG.TILE_HEIGHT;

    for (let row = 0; row <= GAME_CONFIG.TOTAL_TILES; row++) {
      const y = row * GAME_CONFIG.TILE_HEIGHT - offset;

      // Alternate colors for visual effect
      if (Math.floor(row + scrollOffset / GAME_CONFIG.TILE_HEIGHT) % 2 === 0) {
        this.ctx.fillStyle = '#2c3e50';
      } else {
        this.ctx.fillStyle = '#34495e';
      }

      this.ctx.fillRect(0, y, this.canvas.width, GAME_CONFIG.TILE_HEIGHT);
    }
  }

  // Draw lane dividers
  drawLaneDividers(scrollOffset, lanes, laneWidth) {
    this.ctx.strokeStyle = '#f1c40f';
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([20, 10]);

    const offset = scrollOffset % 30;

    for (let i = 1; i < lanes; i++) {
      const x = i * laneWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(x, -offset);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    this.ctx.setLineDash([]);
  }

  // Draw obstacle
  drawObstacle(obstacle, laneWidth) {
    const x = obstacle.lane * laneWidth + laneWidth / 2;
    const y = obstacle.y + GAME_CONFIG.TILE_HEIGHT / 2;

    // Draw obstacle as a crate/barrel
    this.ctx.fillStyle = '#e74c3c';
    this.ctx.fillRect(
      x - laneWidth * 0.3,
      y - GAME_CONFIG.TILE_HEIGHT * 0.3,
      laneWidth * 0.6,
      GAME_CONFIG.TILE_HEIGHT * 0.6
    );

    // Add border
    this.ctx.strokeStyle = '#c0392b';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(
      x - laneWidth * 0.3,
      y - GAME_CONFIG.TILE_HEIGHT * 0.3,
      laneWidth * 0.6,
      GAME_CONFIG.TILE_HEIGHT * 0.6
    );
  }

  // Draw powerup
  drawPowerup(powerup, laneWidth) {
    const x = powerup.lane * laneWidth + laneWidth / 2;
    const y = powerup.y + GAME_CONFIG.TILE_HEIGHT / 2;

    switch (powerup.type) {
      case 'shield':
        this.drawShieldPowerup(x, y);
        break;
      case 'bomb':
        this.drawBombPowerup(x, y);
        break;
      case 'heart':
        this.drawHeartPowerup(x, y);
        break;
      case 'coin':
        this.drawCoinPowerup(x, y);
        break;
    }
  }

  drawShieldPowerup(x, y) {
    // Draw light blue bubble shield powerup
    this.ctx.fillStyle = 'rgba(173, 216, 230, 0.6)';
    this.ctx.beginPath();
    this.ctx.arc(x, y, GAME_CONFIG.TILE_HEIGHT * 0.4, 0, Math.PI * 2);
    this.ctx.fill();

    // Add border
    this.ctx.strokeStyle = '#87CEEB';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(x, y, GAME_CONFIG.TILE_HEIGHT * 0.4, 0, Math.PI * 2);
    this.ctx.stroke();

    // Add shine effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.beginPath();
    this.ctx.arc(x - 5, y - 5, GAME_CONFIG.TILE_HEIGHT * 0.15, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawBombPowerup(x, y) {
    // Draw black cannonball bomb
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.beginPath();
    this.ctx.arc(x, y, GAME_CONFIG.TILE_HEIGHT * 0.35, 0, Math.PI * 2);
    this.ctx.fill();

    // Add shadow/3D effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(x - 5, y - 5, GAME_CONFIG.TILE_HEIGHT * 0.15, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw fuse
    this.ctx.strokeStyle = '#8B4513';
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(x + 8, y - GAME_CONFIG.TILE_HEIGHT * 0.25);
    this.ctx.lineTo(x + 15, y - GAME_CONFIG.TILE_HEIGHT * 0.4);
    this.ctx.stroke();

    // Draw spark at end of fuse
    this.ctx.fillStyle = '#FF4500';
    this.ctx.beginPath();
    this.ctx.arc(x + 15, y - GAME_CONFIG.TILE_HEIGHT * 0.4, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Add flicker effect
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.arc(x + 16, y - GAME_CONFIG.TILE_HEIGHT * 0.42, 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawHeartPowerup(x, y) {
    // Draw red heart
    this.ctx.fillStyle = '#FF0000';
    this.ctx.beginPath();

    // Draw heart using bezier curves
    const heartSize = GAME_CONFIG.TILE_HEIGHT * 0.3;
    this.ctx.moveTo(x, y + heartSize * 0.3);

    // Left side of heart
    this.ctx.bezierCurveTo(
      x,
      y,
      x - heartSize * 0.5,
      y - heartSize * 0.5,
      x - heartSize,
      y
    );
    this.ctx.bezierCurveTo(
      x - heartSize,
      y + heartSize * 0.3,
      x - heartSize * 0.5,
      y + heartSize * 0.7,
      x,
      y + heartSize
    );

    // Right side of heart
    this.ctx.bezierCurveTo(
      x + heartSize * 0.5,
      y + heartSize * 0.7,
      x + heartSize,
      y + heartSize * 0.3,
      x + heartSize,
      y
    );
    this.ctx.bezierCurveTo(
      x + heartSize * 0.5,
      y - heartSize * 0.5,
      x,
      y,
      x,
      y + heartSize * 0.3
    );

    this.ctx.fill();

    // Add shine effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.beginPath();
    this.ctx.arc(
      x - heartSize * 0.3,
      y - heartSize * 0.1,
      heartSize * 0.2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  drawCoinPowerup(x, y) {
    // Draw gold coin
    this.ctx.fillStyle = '#FFD700';
    this.ctx.strokeStyle = '#DAA520';
    this.ctx.lineWidth = 3;

    // Draw coin circle
    this.ctx.beginPath();
    this.ctx.arc(x, y, GAME_CONFIG.TILE_HEIGHT * 0.35, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Add inner circle detail
    this.ctx.strokeStyle = '#DAA520';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y, GAME_CONFIG.TILE_HEIGHT * 0.25, 0, Math.PI * 2);
    this.ctx.stroke();

    // Add $ symbol in center
    this.ctx.fillStyle = '#8B6914';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('$', x, y);

    // Add shine effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.beginPath();
    this.ctx.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Draw shield effect around vehicle
  drawShield(motorcycleLane, motorcycleRow, laneWidth) {
    const x = motorcycleLane * laneWidth + laneWidth / 2;
    const y = motorcycleRow * GAME_CONFIG.TILE_HEIGHT + GAME_CONFIG.TILE_HEIGHT / 2;

    // Draw bubble shield around motorcycle
    this.ctx.strokeStyle = '#87CEEB';
    this.ctx.lineWidth = 4;
    this.ctx.fillStyle = 'rgba(173, 216, 230, 0.3)';

    this.ctx.beginPath();
    this.ctx.arc(x, y, 35, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Add shimmer effect
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x - 10, y - 10, 15, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  // Draw high score text
  drawHighScore(highScore) {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`High Score: ${highScore}`, 10, 25);
  }

  // Render entire frame
  render(gameState, vehicleDrawFunction) {
    this.clear();
    this.drawRoad(gameState.scrollOffset);
    this.drawLaneDividers(gameState.scrollOffset, gameState.lanes, gameState.laneWidth);

    // Draw obstacles
    gameState.obstacles.forEach((obstacle) => {
      this.drawObstacle(obstacle, gameState.laneWidth);
    });

    // Draw powerups
    gameState.powerups.forEach((powerup) => {
      this.drawPowerup(powerup, gameState.laneWidth);
    });

    // Draw vehicle
    const x = gameState.motorcycle.lane * gameState.laneWidth + gameState.laneWidth / 2;
    const y = gameState.motorcycle.row * GAME_CONFIG.TILE_HEIGHT + GAME_CONFIG.TILE_HEIGHT / 2;
    vehicleDrawFunction(this.ctx, x, y);

    // Draw shield if active
    if (gameState.hasShield) {
      this.drawShield(gameState.motorcycle.lane, gameState.motorcycle.row, gameState.laneWidth);
    }

    // Draw high score
    this.drawHighScore(gameState.highScore);
  }
}

// Legend rendering functions (separate from main game rendering)
export const LegendRenderer = {
  renderObstacle(canvas) {
    const ctx = canvas.getContext('2d');
    const centerX = 20;
    const centerY = 20;
    const size = 24;

    // Draw red crate
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);

    // Add border
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - size / 2, centerY - size / 2, size, size);
  },

  renderHeart(canvas) {
    const ctx = canvas.getContext('2d');
    const centerX = 20;
    const centerY = 20;
    const heartSize = 12;

    ctx.fillStyle = '#FF0000';
    ctx.beginPath();

    // Draw heart using bezier curves
    ctx.moveTo(centerX, centerY + heartSize * 0.3);

    // Left side
    ctx.bezierCurveTo(
      centerX,
      centerY,
      centerX - heartSize * 0.5,
      centerY - heartSize * 0.5,
      centerX - heartSize,
      centerY
    );
    ctx.bezierCurveTo(
      centerX - heartSize,
      centerY + heartSize * 0.3,
      centerX - heartSize * 0.5,
      centerY + heartSize * 0.7,
      centerX,
      centerY + heartSize
    );

    // Right side
    ctx.bezierCurveTo(
      centerX + heartSize * 0.5,
      centerY + heartSize * 0.7,
      centerX + heartSize,
      centerY + heartSize * 0.3,
      centerX + heartSize,
      centerY
    );
    ctx.bezierCurveTo(
      centerX + heartSize * 0.5,
      centerY - heartSize * 0.5,
      centerX,
      centerY,
      centerX,
      centerY + heartSize * 0.3
    );

    ctx.fill();

    // Add shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(centerX - heartSize * 0.3, centerY - heartSize * 0.1, heartSize * 0.2, 0, Math.PI * 2);
    ctx.fill();
  },

  renderCoin(canvas) {
    const ctx = canvas.getContext('2d');
    const centerX = 20;
    const centerY = 20;
    const coinRadius = 14;

    // Draw gold coin
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, coinRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Add inner circle
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, coinRadius * 0.7, 0, Math.PI * 2);
    ctx.stroke();

    // Add $ symbol
    ctx.fillStyle = '#8B6914';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', centerX, centerY);
  },

  renderShield(canvas) {
    const ctx = canvas.getContext('2d');
    const centerX = 20;
    const centerY = 20;
    const shieldRadius = 16;

    // Draw light blue bubble
    ctx.fillStyle = 'rgba(173, 216, 230, 0.6)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
    ctx.fill();

    // Add border
    ctx.strokeStyle = '#87CEEB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Add shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(centerX - 5, centerY - 5, 6, 0, Math.PI * 2);
    ctx.fill();
  },

  renderBomb(canvas) {
    const ctx = canvas.getContext('2d');
    const centerX = 20;
    const centerY = 20;
    const bombRadius = 14;

    // Draw black cannonball
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(centerX, centerY, bombRadius, 0, Math.PI * 2);
    ctx.fill();

    // Add shadow/3D effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(centerX - 5, centerY - 5, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw fuse
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(centerX + 8, centerY - bombRadius * 0.7);
    ctx.lineTo(centerX + 15, centerY - bombRadius * 1.1);
    ctx.stroke();

    // Draw spark at end of fuse
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.arc(centerX + 15, centerY - bombRadius * 1.1, 3, 0, Math.PI * 2);
    ctx.fill();

    // Add flicker effect
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX + 16, centerY - bombRadius * 1.15, 2, 0, Math.PI * 2);
    ctx.fill();
  },

  renderAll() {
    const obstacleCanvas = document.getElementById('legendObstacle');
    const heartCanvas = document.getElementById('legendHeart');
    const coinCanvas = document.getElementById('legendCoin');
    const shieldCanvas = document.getElementById('legendShield');
    const bombCanvas = document.getElementById('legendBomb');

    if (obstacleCanvas) this.renderObstacle(obstacleCanvas);
    if (heartCanvas) this.renderHeart(heartCanvas);
    if (coinCanvas) this.renderCoin(coinCanvas);
    if (shieldCanvas) this.renderShield(shieldCanvas);
    if (bombCanvas) this.renderBomb(bombCanvas);
  },
};
