import type { EventQueue } from '@paima/events';
import { generateAppEvents } from '@paima/events';
import { genEvent } from '@paima/events';
import { Type } from '@sinclair/typebox';

export const CreatedLobby_v1 = genEvent({
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
} as const);

export const CreatedLobby_v2 = genEvent({
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

export const JoinedLobby = genEvent({
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

export const MatchWon = genEvent({
  name: 'MatchWon',
  fields: [
    {
      indexed: true,
      name: 'winner',
      type: Type.String(),
    },
  ],
});

const eventDefinitions = [CreatedLobby_v1, CreatedLobby_v2, JoinedLobby, MatchWon] as const;

export const events = generateAppEvents(eventDefinitions);

export type Events = EventQueue<typeof eventDefinitions>;
