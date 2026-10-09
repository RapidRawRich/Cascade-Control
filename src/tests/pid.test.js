import { describe, it, expect } from 'vitest';
import { PIDController } from '../physics/pid.js';

describe('PIDController (ILM 310305e Implementation)', () => {
  it('correctly calculates Reverse Acting control error (Heating loop)', () => {
    const pid = new PIDController({
      tag: 'TIC-101',
      action: 'REVERSE',
      Kc: 2.0,
      Ti: 10.0,
      bias: 50.0,
      pv: 100.0,
      sp: 120.0, // PV is below SP (needs more heat)
      mode: 'AUTO'
    });

    const co = pid.step(100.0, 0.01);
    // Reverse action: error = SP - PV = 20. Error% = 20/200 * 100 = 10%.
    // P-term = Kc * error% = 2.0 * 10% = +20%.
    // CO should increase above bias (50 + 20 = 70%)
    expect(co).toBeGreaterThan(50.0);
  });

  it('correctly calculates Direct Acting control error', () => {
    const pid = new PIDController({
      tag: 'FIC-101',
      action: 'DIRECT',
      Kc: 2.0,
      Ti: 10.0,
      bias: 50.0,
      pv: 60.0,
      sp: 50.0, // PV is above SP
      mode: 'AUTO'
    });

    const co = pid.step(60.0, 0.01);
    // Direct action: error = PV - SP = 10%. P-term = +20%.
    expect(co).toBeGreaterThan(50.0);
  });

  it('performs bumpless transfer when switching from MANUAL to AUTO', () => {
    const pid = new PIDController({
      mode: 'MANUAL',
      manualCO: 65.0,
      pv: 110.0
    });

    // Step in manual
    const coMan = pid.step(110.0, 0.01);
    expect(coMan).toBe(65.0);

    // Switch to AUTO
    pid.setMode('AUTO');
    // SP should have tracked PV (SP = 110)
    expect(pid.sp).toBe(110.0);

    // Immediate next step in AUTO should not cause sudden jump (CO ~ 65%)
    const coAuto = pid.step(110.0, 0.01);
    expect(Math.abs(coAuto - 65.0)).toBeLessThan(0.1);
  });

  it('prevents reset windup via External Feedback (EF)', () => {
    const pid = new PIDController({
      tag: 'TIC-101',
      mode: 'CASCADE',
      useExternalFeedback: true,
      Kc: 2.0,
      Ti: 1.0,
      bias: 50.0,
      sp: 120.0,
      pv: 90.0 // Large sustained error of 30 deg
    });

    // Step 200 times with external feedback locked at 55%
    for (let i = 0; i < 200; i++) {
      pid.step(90.0, 0.1, 120.0, 55.0);
    }

    // Because EF is connected to 55%, bias does not wind up to infinity or 1000%
    expect(pid.co).toBeLessThanOrEqual(100.0);
    expect(pid.bias).toBeLessThan(100.0);
  });

  it('avoids derivative kick on setpoint change (Derivative on PV)', () => {
    const pid = new PIDController({
      action: 'REVERSE',
      Kc: 2.0,
      Ti: 5.0,
      Td: 1.0,
      sp: 100.0,
      pv: 100.0,
      mode: 'AUTO'
    });

    // Steady state step
    pid.step(100.0, 0.01);

    // Sudden setpoint change from 100 to 140 while PV remains at 100
    pid.sp = 140.0;
    const coAfterSPChange = pid.step(100.0, 0.01);

    // Since derivative acts on PV (which stayed at 100), dTerm is 0!
    // Output change is purely proportional and integral
    expect(coAfterSPChange).toBeGreaterThan(50.0);
    expect(coAfterSPChange).toBeLessThan(100.0);
  });
});
