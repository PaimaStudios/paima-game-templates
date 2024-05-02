import parse from './parser';

describe('Input parsing', () => {
  test('parses submitMineAttempt', () => {
    const parsed = parse('m|');
    expect(parsed.input).toBe('submitMineAttempt');
  });
});
