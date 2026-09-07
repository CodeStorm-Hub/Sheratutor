import { describe, it, expect } from 'vitest';
import { verifyPhysicsCalculation, requestPracticeQuizInterrupt } from './tutor-tools';

describe('verifyPhysicsCalculation Tool', () => {
  it('calculates velocity using v = u + at', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 'v = u + at',
      variables: { u: 0, a: 2, t: 10 },
      targetVariable: 'v',
    });

    expect(res.result).toBe(20);
    expect(res.unit).toBe('ms⁻¹');
    expect(res.steps).toHaveLength(3);
    expect(res.steps[1]).toContain('0 + (2 × 10)');
  });

  it('calculates distance using s = ut + 0.5at^2', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 's = ut + 0.5at^2',
      variables: { u: 5, a: 4, t: 3 },
      targetVariable: 's',
    });

    // s = 5*3 + 0.5*4*9 = 15 + 18 = 33
    expect(res.result).toBe(33);
    expect(res.unit).toBe('m');
  });

  it('calculates force using F = ma', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 'F = ma',
      variables: { m: 15, a: 3 },
      targetVariable: 'F',
    });

    expect(res.result).toBe(45);
    expect(res.unit).toBe('N');
  });

  it('calculates kinetic energy using Ek = 0.5mv^2', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 'Ek = 0.5mv^2',
      variables: { m: 2, v: 10 },
      targetVariable: 'Ek',
    });

    // Ek = 0.5 * 2 * 100 = 100
    expect(res.result).toBe(100);
    expect(res.unit).toBe('J');
  });

  it('calculates time using v = u + at', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 'v = u + at',
      variables: { u: 0, v: 20, a: 2 },
      targetVariable: 't',
    });

    expect(res.result).toBe(10);
    expect(res.unit).toBe('s');
  });

  it('calculates average velocity distance using s = ((u+v)/2)*t', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 's = ((u+v)/2)*t',
      variables: { u: 10, v: 30, t: 5 },
      targetVariable: 's',
    });

    // s = ((10 + 30) / 2) * 5 = 20 * 5 = 100
    expect(res.result).toBe(100);
    expect(res.unit).toBe('m');
  });

  it('calculates mass from force and acceleration using F = ma', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 'F = ma',
      variables: { F: 60, a: 3 },
      targetVariable: 'm',
    });

    expect(res.result).toBe(20);
    expect(res.unit).toBe('kg');
  });

  it('calculates velocity from kinetic energy using Ek = 0.5mv^2', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 'Ek = 0.5mv^2',
      variables: { Ek: 200, m: 4 },
      targetVariable: 'v',
    });

    // v = sqrt(2 * 200 / 4) = sqrt(100) = 10
    expect(res.result).toBe(10);
    expect(res.unit).toBe('ms⁻¹');
  });

  it('calculates density using density = m/V', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 'density = m/V',
      variables: { m: 1000, V: 2 },
      targetVariable: 'density',
    });

    expect(res.result).toBe(500);
    expect(res.unit).toBe('kg m⁻³');
  });

  it('calculates hydrostatic pressure using P = h_rho_g', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 'P = h_rho_g',
      variables: { h: 10, rho: 1000, g: 9.8 },
      targetVariable: 'P',
    });

    // P = 10 * 1000 * 9.8 = 98000
    expect(res.result).toBe(98000);
    expect(res.unit).toBe('Pa');
  });

  it('calculates electrical power using P = VI', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 'P = VI',
      variables: { V: 220, I: 5 },
      targetVariable: 'P',
    });

    expect(res.result).toBe(1100);
    expect(res.unit).toBe('W');
  });

  it('handles stringified variables correctly', async () => {
    const res = await verifyPhysicsCalculation({
      formula: 'v = u + at',
      variables: "{'u': 5, 'a': 3, 't': 4}",
      targetVariable: 'v',
    });

    expect(res.result).toBe(17);
    expect(res.unit).toBe('ms⁻¹');
  });
});

describe('requestPracticeQuizInterrupt Tool', () => {
  it('is properly registered as an interrupt action', () => {
    expect(requestPracticeQuizInterrupt).toBeDefined();
    expect(requestPracticeQuizInterrupt.name).toBe('actionFn');
  });
});
