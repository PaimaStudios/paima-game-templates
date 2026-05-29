import parse from './parser';

describe('Input parsing', () => {
  test('parses joinWorld', () => {
    const parsed = parse('j|');
    expect(parsed.input).toBe('joinWorld');
  });

  test('parses submitMove', () => {
    const parsed = parse('m|*Xs6Q9GAqZVwe|1|2');
    expect(parsed.input).toBe('submitMove');
  });

  test('parses submitIncrement', () => {
    const parsed = parse('i|*1|*2');

    expect(parsed.input).toBe('submitIncrement');
  });
});
