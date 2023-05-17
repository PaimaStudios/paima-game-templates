import parse from './parser';

describe('Input parsing', () => {
  test('parses gainedExperience', () => {
    const parsed = parse('xp|*s4da84aw8ead4f86e|3');
    expect(parsed.input).toBe('gainedExperience');
  });
});
