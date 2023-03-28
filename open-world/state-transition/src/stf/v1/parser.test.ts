import parse from './parser';

describe('Input parsing', () => {
  test('parses createLobby', () => {
    const normalLobby = parse('c|20|100|100|||T');
    expect(normalLobby.input).toBe('createdLobby');

    const hiddenLobby = parse('c|20|100|100|T|T|');
    expect(hiddenLobby.input).toBe('createdLobby');

    const practiceLobby = parse('c|20|100|100||T|T');
    expect(practiceLobby.input).toBe('createdLobby');
  });

  test('parses joinLobby', () => {
    const parsed = parse('j|*Xs6Q9GAqZVwe');
    expect(parsed.input).toBe('joinedLobby');
  });

  test('parses closeLobby', () => {
    const parsed = parse('cs|*Xs6Q9GAqZVwe');
    expect(parsed.input).toBe('closedLobby');
  });

  test('parses submitMoves', () => {
    const parsed = parse('s|*Xs6Q9GAqZVwe|2|f4 e5'); // OpenWorld PGN
    expect(parsed.input).toBe('submittedMoves');
  });

  test('parses scheduled data', () => {
    const zombie = parse('z|*Xs6Q9GAqZVwe');
    expect(zombie.input).toBe('scheduledData');
    if (zombie.input === 'scheduledData') {
      expect(zombie.effect.type).toBe('zombie');
    }

    const stats = parse('u|*0xc02aeafdca98755a2bfbcdf5f68364aacef67d3c|w');
    expect(stats.input).toBe('scheduledData');
    if (stats.input === 'scheduledData') {
      expect(stats.effect.type).toBe('stats');
    }
  });
});
