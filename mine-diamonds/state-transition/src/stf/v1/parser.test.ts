import parse from './parser';

describe('Input parsing', () => {
  test('parses joinWorld', () => {
    const parsed = parse('j|');
    expect(parsed.input).toBe('joinWorld');
  });

  test('parses submitMineAttempt', () => {
    const parsed = parse('m|');
    expect(parsed.input).toBe('submitMineAttempt');
  });
});
