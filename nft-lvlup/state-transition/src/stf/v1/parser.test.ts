import parse from './parser';

describe('Input parsing', () => {
  test('parses lvlup', () => {
    const parsed = parse('l|0xf2DAaaE587dfc4a51ff2d559eA0bC13358d0b712|*10');
    expect(parsed.input).toBe('lvlUp');
  });

  test('parses nftmint', () => {
    const parsed = parse('nftmint|0xf2DAaaE587dfc4a51ff2d559eA0bC13358d0b712|10|air');
    expect(parsed.input).toBe('scheduledData');
    if (parsed.input === 'scheduledData') {
      expect(parsed.effect).toBe('nftMint');
    }
  });
});
