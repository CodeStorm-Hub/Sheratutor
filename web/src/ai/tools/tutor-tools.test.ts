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
      variables: { u: '5', a: '3', t: '4' },
      targetVariable: 'v',
    });

    expect(res.result).toBe(17);
    expect(res.unit).toBe('ms⁻¹');
  });

  it('calculates roots of quadratic equation ax^2 + bx + c = 0', async () => {
    // x^2 - 5x + 6 = 0 -> roots are 3 and 2
    const res1 = await verifyPhysicsCalculation({
      formula: 'quadratic: ax^2 + bx + c = 0',
      variables: { a: 1, b: -5, c: 6 },
      targetVariable: 'x1',
    });
    const res2 = await verifyPhysicsCalculation({
      formula: 'quadratic: ax^2 + bx + c = 0',
      variables: { a: 1, b: -5, c: 6 },
      targetVariable: 'x2',
    });

    expect(res1.result).toBe(3);
    expect(res2.result).toBe(2);
    expect(res1.steps[0]).toContain('Formula: x₁');
  });

  it('calculates arithmetic progression n-th term and sum', async () => {
    // a = 5, d = 3, n = 10 -> a_10 = 5 + 9*3 = 32; S_10 = 5 * (10 + 27) = 185
    const resTerm = await verifyPhysicsCalculation({
      formula: 'ap_term: an = a + (n-1)d',
      variables: { a: 5, d: 3, n: 10 },
      targetVariable: 'an',
    });
    const resSum = await verifyPhysicsCalculation({
      formula: 'ap_sum: Sn = n/2(2a + (n-1)d)',
      variables: { a: 5, d: 3, n: 10 },
      targetVariable: 'Sn',
    });

    expect(resTerm.result).toBe(32);
    expect(resSum.result).toBe(185);
  });

  it('calculates geometric progression n-th term and sum', async () => {
    // a = 2, r = 3, n = 4 -> a_4 = 2 * 27 = 54; S_4 = 2 * (81 - 1) / 2 = 80
    const resTerm = await verifyPhysicsCalculation({
      formula: 'gp_term: an = a*r^(n-1)',
      variables: { a: 2, r: 3, n: 4 },
      targetVariable: 'an',
    });
    const resSum = await verifyPhysicsCalculation({
      formula: 'gp_sum: Sn = a(r^n - 1)/(r - 1)',
      variables: { a: 2, r: 3, n: 4 },
      targetVariable: 'Sn',
    });

    expect(resTerm.result).toBe(54);
    expect(resSum.result).toBe(80);
  });

  it('calculates statistics grouped median', async () => {
    // L = 40, n = 50 (n/2 = 25), Fc = 18, fm = 14, h = 10 -> 40 + (7 / 14) * 10 = 45
    const res = await verifyPhysicsCalculation({
      formula: 'grouped_median: L + ((n/2 - Fc)/fm)*h',
      variables: { L: 40, n: 50, Fc: 18, fm: 14, h: 10 },
      targetVariable: 'median',
    });

    expect(res.result).toBe(45);
  });

  it('calculates hypotenuse using Pythagoras theorem', async () => {
    // a = 3, b = 4 -> c = 5
    const res = await verifyPhysicsCalculation({
      formula: 'pythagoras: c^2 = a^2 + b^2',
      variables: { a: 3, b: 4 },
      targetVariable: 'c',
    });

    expect(res.result).toBe(5);
  });
});

describe('requestPracticeQuizInterrupt Tool', () => {
  it('is properly registered as an interrupt action', () => {
    expect(requestPracticeQuizInterrupt).toBeDefined();
    expect(requestPracticeQuizInterrupt.name).toBe('actionFn');
  });
});
