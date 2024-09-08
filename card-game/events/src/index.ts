import type { EventQueue } from '@paima/events';
import { registerEvents } from '@paima/events';
import { genEvent } from '@paima/events';
import { Type } from '@sinclair/typebox';

export const ClickEvent = genEvent({
  name: 'MyClickEvent',
  fields: [
    {
      indexed: true,
      name: 'user',
      type: Type.String(),
    },
    {
      name: 'time',
      type: Type.Number(),
    },
  ],
});

export const eventDefinitions = {
  ClickEvent,
} as const;

export const events = registerEvents(eventDefinitions);
export type Events = EventQueue<typeof eventDefinitions>;
