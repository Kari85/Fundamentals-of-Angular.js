/*
  GreenSense AI Industrial

  A small TypeScript module for monitoring industrial sensor readings,
  estimating energy efficiency, and producing maintenance recommendations.
*/

type SensorReading = {
  machineId: string;
  timestamp: Date;
  temperatureCelsius: number;
  vibrationMmPerSecond: number;
  powerKilowatts: number;
  productionUnits: number;
};

type MachineHealth = 'normal' | 'warning' | 'critical';

type SustainabilityInsight = {
  machineId: string;
  health: MachineHealth;
  energyPerUnit: number;
  co2KgEstimate: number;
  recommendations: string[];
};

const CO2_KG_PER_KWH = 0.233;
const WARNING_TEMPERATURE = 75;
const CRITICAL_TEMPERATURE = 90;
const WARNING_VIBRATION = 7.1;
const CRITICAL_VIBRATION = 11.0;

function calculateEnergyPerUnit(reading: SensorReading): number {
  if (reading.productionUnits <= 0) {
    return reading.powerKilowatts;
  }

  return Number((reading.powerKilowatts / reading.productionUnits).toFixed(2));
}

function estimateCo2Kg(powerKilowatts: number, operatingHours: number): number {
  return Number((powerKilowatts * operatingHours * CO2_KG_PER_KWH).toFixed(2));
}

function evaluateMachineHealth(reading: SensorReading): MachineHealth {
  if (
    reading.temperatureCelsius >= CRITICAL_TEMPERATURE ||
    reading.vibrationMmPerSecond >= CRITICAL_VIBRATION
  ) {
    return 'critical';
  }

  if (
    reading.temperatureCelsius >= WARNING_TEMPERATURE ||
    reading.vibrationMmPerSecond >= WARNING_VIBRATION
  ) {
    return 'warning';
  }

  return 'normal';
}

function buildRecommendations(reading: SensorReading, health: MachineHealth): string[] {
  const recommendations: string[] = [];

  if (health === 'critical') {
    recommendations.push('Stop the machine and schedule immediate maintenance.');
  } else if (health === 'warning') {
    recommendations.push('Inspect bearings, lubrication, and cooling during the next service window.');
  } else {
    recommendations.push('Machine is operating inside the normal GreenSense range.');
  }

  if (calculateEnergyPerUnit(reading) > 1.5) {
    recommendations.push('Review load balancing and idle time to reduce energy per produced unit.');
  }

  if (reading.productionUnits === 0 && reading.powerKilowatts > 0) {
    recommendations.push('Machine is consuming energy without production; consider automatic standby mode.');
  }

  return recommendations;
}

function analyzeReading(reading: SensorReading, operatingHours: number = 1): SustainabilityInsight {
  const health = evaluateMachineHealth(reading);

  return {
    machineId: reading.machineId,
    health,
    energyPerUnit: calculateEnergyPerUnit(reading),
    co2KgEstimate: estimateCo2Kg(reading.powerKilowatts, operatingHours),
    recommendations: buildRecommendations(reading, health),
  };
}

const sampleReadings: SensorReading[] = [
  {
    machineId: 'CNC-01',
    timestamp: new Date('2026-07-17T08:00:00Z'),
    temperatureCelsius: 72,
    vibrationMmPerSecond: 5.8,
    powerKilowatts: 42,
    productionUnits: 38,
  },
  {
    machineId: 'PRESS-04',
    timestamp: new Date('2026-07-17T08:00:00Z'),
    temperatureCelsius: 93,
    vibrationMmPerSecond: 12.4,
    powerKilowatts: 65,
    productionUnits: 25,
  },
];

const insights = sampleReadings.map(reading => analyzeReading(reading, 1));

insights.forEach(insight => {
  console.log(`Machine: ${insight.machineId}`);
  console.log(`Health: ${insight.health}`);
  console.log(`Energy per unit: ${insight.energyPerUnit} kWh/unit`);
  console.log(`Estimated CO2: ${insight.co2KgEstimate} kg`);
  console.log(`Recommendations: ${insight.recommendations.join(' ')}`);
});
