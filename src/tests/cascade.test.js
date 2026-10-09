import { describe, it, expect } from 'vitest';
import { CascadeSimulationEngine } from '../physics/cascadeEngine.js';
import { ValveModel } from '../physics/valveModel.js';

describe('Cascade vs Conventional Simulation Physics (ILM 310305e)', () => {
  it('demonstrates superior disturbance rejection under cascade control', () => {
    const engine = new CascadeSimulationEngine();

    // 1. Run to steady state
    for (let i = 0; i < 400; i++) {
      engine.step(1);
    }

    const baselineSnapshot = engine.getSnapshot();
    expect(Math.abs(baselineSnapshot.casPriPV - 120.0)).toBeLessThan(1.0);
    expect(Math.abs(baselineSnapshot.convPV - 120.0)).toBeLessThan(1.0);

    // 2. Inject Steam Header Pressure Drop (-30%)
    engine.triggerSteamDrop(30);

    // Run 300 simulation steps
    for (let i = 0; i < 300; i++) {
      engine.step(1);
    }

    const upsetSnapshot = engine.getSnapshot();

    // In Conventional control, steam flow dropped and temperature dropped significantly
    // In Cascade control, secondary FIC-101 immediately opened the valve to keep flow at RSP
    const casTempDev = Math.abs(upsetSnapshot.casPriPV - 120.0);
    const convTempDev = Math.abs(upsetSnapshot.convPV - 120.0);

    // Cascade temperature error must be substantially smaller than conventional
    expect(casTempDev).toBeLessThan(convTempDev);
    // Cascade secondary controller should have compensated by opening valve
    expect(upsetSnapshot.casValvePos).toBeGreaterThan(upsetSnapshot.convValvePos);
  });

  it('verifies valve stiction deadband hysteresis behavior', () => {
    const valve = new ValveModel({
      tauActuator: 0.01,
      stictionDeadband: 5.0, // 5% stiction deadband
      stictionSlipJump: 1.0
    });

    valve.stemPosition = 50.0;

    // Small command change of 2% (less than 5% deadband)
    valve.step(52.0, 0.1);
    // Stem should remain stuck at 50%
    expect(valve.stemPosition).toBe(50.0);

    // Command change of 7% (exceeds 5% deadband)
    valve.step(57.0, 0.1);
    // Stem overcomes static friction and slips!
    expect(valve.stemPosition).toBeGreaterThan(50.0);
  });

  it('verifies effective closed-loop time constant calculation matches ILM Objective 3', () => {
    // ILM Page 28-29 Example:
    // tau_p = 8.8 min, Kp = 1.7, Kc = 2.0
    const tauP = 8.8;
    const Kp = 1.7;
    const Kc = 2.0;

    const denominator = 1.0 + Math.abs(Kc * Kp);
    const tauEff = tauP / denominator;

    // 8.8 / (1 + 3.4) = 8.8 / 4.4 = 2.0 min
    expect(tauEff).toBeCloseTo(2.0, 2);
  });
});
