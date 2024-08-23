import type { EventQueue } from '@paima/events';
import { registerEvents } from '@paima/events';
import { genEvent, toSignature, toSignatureHash } from '@paima/events';
import { Type } from '@sinclair/typebox';

const CreatedLobby_v1 = genEvent({
  name: 'CreatedLobby',
  fields: [
    {
      indexed: true,
      name: 'user',
      type: Type.String(),
    },
    {
      indexed: true,
      name: 'lobbyId',
      type: Type.String(),
    },
    {
      indexed: false,
      name: 'rounds',
      type: Type.Number(),
    },
  ],
});

const CreatedLobby_v2 = genEvent({
  name: 'CreatedLobby',
  fields: [
    {
      indexed: true,
      name: 'user',
      type: Type.String(),
    },
    {
      indexed: true,
      name: 'lobbyId',
      type: Type.String(),
    },
    {
      indexed: false,
      name: 'rounds',
      type: Type.Number(),
    },
    {
      indexed: false,
      name: 'isPractice',
      type: Type.Boolean(),
    },
  ],
});

const JoinedLobby = genEvent({
  name: 'JoinedLobby',
  fields: [
    {
      indexed: true,
      name: 'lobbyId',
      type: Type.String(),
    },
    {
      indexed: false,
      name: 'player',
      type: Type.String(),
    },
  ],
});

const MatchWon = genEvent({
  name: 'MatchWon',
  fields: [
    {
      indexed: true,
      name: 'winner',
      type: Type.String(),
    },
  ],
});

const PlayerMoved = genEvent({
  name: 'PlayerMoved',
  fields: [
    {
      indexed: true,
      name: 'lobbyId',
      type: Type.String(),
    },
    {
      name: 'move',
      type: Type.String(),
    },
    {
      name: 'round',
      type: Type.Number(),
    },
  ],
});

const eventDefinitions = [
  CreatedLobby_v1,
  CreatedLobby_v2,
  JoinedLobby,
  MatchWon,
  PlayerMoved,
] as const;

export const events = generateAppEvents(eventDefinitions);

export type Events = EventQueue<typeof eventDefinitions>;
