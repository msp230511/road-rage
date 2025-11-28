// Vehicle System - Data-driven vehicle and modification configuration
import { Storage } from './storage.js';

// Vehicle drawing functions
const VehicleDrawFunctions = {
  motorcycle(context, x, y, scale = 1) {
    // Motorcycle body
    context.fillStyle = "#3498db";
    context.beginPath();
    context.moveTo(x, y - 20 * scale);
    context.lineTo(x - 15 * scale, y + 15 * scale);
    context.lineTo(x + 15 * scale, y + 15 * scale);
    context.closePath();
    context.fill();

    // Wheels
    context.fillStyle = "#2c3e50";
    context.beginPath();
    context.arc(x - 8 * scale, y + 12 * scale, 5 * scale, 0, Math.PI * 2);
    context.arc(x + 8 * scale, y + 12 * scale, 5 * scale, 0, Math.PI * 2);
    context.fill();

    // Rider
    context.fillStyle = "#e67e22";
    context.beginPath();
    context.arc(x, y - 5 * scale, 8 * scale, 0, Math.PI * 2);
    context.fill();
  },

  car(context, x, y, scale = 1) {
    // Car body (sleek sports car shape)
    context.fillStyle = "#e74c3c";
    context.fillRect(x - 18 * scale, y - 10 * scale, 36 * scale, 30 * scale);

    // Car hood (front triangle)
    context.fillStyle = "#c0392b";
    context.beginPath();
    context.moveTo(x, y - 20 * scale);
    context.lineTo(x - 18 * scale, y - 10 * scale);
    context.lineTo(x + 18 * scale, y - 10 * scale);
    context.closePath();
    context.fill();

    // Windshield
    context.fillStyle = "#3498db";
    context.fillRect(x - 12 * scale, y - 5 * scale, 24 * scale, 12 * scale);

    // Wheels
    context.fillStyle = "#2c3e50";
    context.fillRect(x - 20 * scale, y + 15 * scale, 8 * scale, 8 * scale);
    context.fillRect(x + 12 * scale, y + 15 * scale, 8 * scale, 8 * scale);

    // Spoiler
    context.fillStyle = "#2c3e50";
    context.fillRect(x - 15 * scale, y + 18 * scale, 30 * scale, 3 * scale);
  },

  truck(context, x, y, scale = 1) {
    // Truck bed (back)
    context.fillStyle = "#f39c12";
    context.fillRect(x - 20 * scale, y + 5 * scale, 40 * scale, 15 * scale);

    // Truck cab (front)
    context.fillStyle = "#e67e22";
    context.fillRect(x - 18 * scale, y - 15 * scale, 36 * scale, 20 * scale);

    // Cab roof
    context.fillStyle = "#d35400";
    context.fillRect(x - 15 * scale, y - 20 * scale, 30 * scale, 5 * scale);

    // Windshield
    context.fillStyle = "#3498db";
    context.fillRect(x - 12 * scale, y - 12 * scale, 24 * scale, 8 * scale);

    // Monster truck wheels (huge)
    context.fillStyle = "#2c3e50";
    context.beginPath();
    context.arc(x - 15 * scale, y + 20 * scale, 10 * scale, 0, Math.PI * 2);
    context.arc(x + 15 * scale, y + 20 * scale, 10 * scale, 0, Math.PI * 2);
    context.fill();

    // Wheel rims
    context.fillStyle = "#7f8c8d";
    context.beginPath();
    context.arc(x - 15 * scale, y + 20 * scale, 5 * scale, 0, Math.PI * 2);
    context.arc(x + 15 * scale, y + 20 * scale, 5 * scale, 0, Math.PI * 2);
    context.fill();
  },
};

// Vehicle configuration data
export const VEHICLE_DATA = {
  motorcycle: {
    id: 'motorcycle',
    name: 'MOTORCYCLE',
    price: 0, // Free by default
    drawFunction: VehicleDrawFunctions.motorcycle,
  },
  car: {
    id: 'car',
    name: 'SPORTS CAR',
    price: 50,
    drawFunction: VehicleDrawFunctions.car,
  },
  truck: {
    id: 'truck',
    name: 'MONSTER TRUCK',
    price: 100,
    drawFunction: VehicleDrawFunctions.truck,
  },
};

// Modification configuration - extensible and data-driven
export const MOD_DATA = {
  motorcycle: [
    {
      id: 'mod1',
      name: 'Shield Start',
      price: 15,
      description: 'Start each life with a shield',
      effect: 'startWithShield',
    },
    {
      id: 'mod2',
      name: 'Heart Boost',
      price: 30,
      description: 'Hearts spawn 50% more often',
      effect: 'heartSpawnBoost',
    },
    {
      id: 'mod3',
      name: 'Second Chance',
      price: 60,
      description: '20% chance to survive fatal hit',
      effect: 'survivalChance20',
    },
  ],
  car: [
    {
      id: 'mod1',
      name: 'Turbo Boost',
      price: 10,
      description: '50% faster boost speed',
      effect: 'boostSpeed25',
    },
    {
      id: 'mod2',
      name: 'Double Money',
      price: 50,
      description: 'Coins are worth 2x',
      effect: 'coinValue2x',
    },
    {
      id: 'mod3',
      name: 'Score Master',
      price: 75,
      description: 'Score multiplier 1.5x',
      effect: 'scoreMultiplier1_5x',
    },
  ],
  truck: [
    {
      id: 'mod1',
      name: 'Time Lord',
      price: 40,
      description: 'Start with 5 hearts instead of 3',
      effect: 'maxHealth5',
    },
    {
      id: 'mod2',
      name: 'Reinforced Shield',
      price: 65,
      description: 'Shields protect against 2 hits',
      effect: 'shieldDoubleHit',
    },
    {
      id: 'mod3',
      name: 'Tank Mode',
      price: 80,
      description: '35% chance to survive fatal hit',
      effect: 'survivalChance35',
    },
  ],
};

// Mod effect value mappings
const MOD_EFFECT_VALUES = {
  coinValue2x: 2,
  scoreMultiplier1_5x: 1.5,
  boostSpeed25: 1.5,
  heartSpawnBoost: 1.5,
};

// Vehicle System class
export class VehicleSystem {
  constructor() {
    this.unlockedVehicles = Storage.loadUnlockedVehicles();
    this.unlockedMods = Storage.loadUnlockedMods();
    this.selectedVehicle = 'motorcycle';
  }

  // Vehicle Management
  isVehicleUnlocked(vehicleType) {
    return this.unlockedVehicles.includes(vehicleType);
  }

  unlockVehicle(vehicleType) {
    if (!this.isVehicleUnlocked(vehicleType)) {
      this.unlockedVehicles.push(vehicleType);
      Storage.saveUnlockedVehicles(this.unlockedVehicles);
    }
  }

  getVehicleData(vehicleType) {
    return VEHICLE_DATA[vehicleType];
  }

  getAllVehicles() {
    return Object.values(VEHICLE_DATA);
  }

  setSelectedVehicle(vehicleType) {
    if (this.isVehicleUnlocked(vehicleType)) {
      this.selectedVehicle = vehicleType;
    }
  }

  getSelectedVehicle() {
    return this.selectedVehicle;
  }

  // Mod Management
  isModUnlocked(vehicleType, modId) {
    return this.unlockedMods[vehicleType]?.includes(modId) || false;
  }

  unlockMod(vehicleType, modId) {
    if (!this.isModUnlocked(vehicleType, modId)) {
      if (!this.unlockedMods[vehicleType]) {
        this.unlockedMods[vehicleType] = [];
      }
      this.unlockedMods[vehicleType].push(modId);
      Storage.saveUnlockedMods(this.unlockedMods);
    }
  }

  getVehicleMods(vehicleType) {
    return MOD_DATA[vehicleType] || [];
  }

  getUnlockedModIds(vehicleType) {
    return this.unlockedMods[vehicleType] || [];
  }

  // Check if current vehicle has a specific mod effect
  hasModEffect(effectName) {
    const vehicleMods = this.getVehicleMods(this.selectedVehicle);
    const unlockedModIds = this.getUnlockedModIds(this.selectedVehicle);

    return vehicleMods.some(
      (mod) => unlockedModIds.includes(mod.id) && mod.effect === effectName
    );
  }

  // Get mod effect value (for multipliers, etc.)
  getModEffectValue(effectName, defaultValue = 1) {
    if (!this.hasModEffect(effectName)) return defaultValue;
    return MOD_EFFECT_VALUES[effectName] || defaultValue;
  }

  // Drawing
  drawVehicle(context, vehicleType, x, y, scale = 1) {
    const vehicleData = VEHICLE_DATA[vehicleType];
    if (vehicleData && vehicleData.drawFunction) {
      vehicleData.drawFunction(context, x, y, scale);
    }
  }
}
