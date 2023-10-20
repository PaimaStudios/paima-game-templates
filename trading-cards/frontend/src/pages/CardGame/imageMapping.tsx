import rock from "@assets/images/rock.png";
import paper from "@assets/images/paper.png";
import scissors from "@assets/images/scissors.png";
import type { CardRegistryId } from "@cards/game-logic";

export const imageRegistry: Record<CardRegistryId, string> = {
  0: `url(${rock})`,
  1: `url(${scissors})`,
  2: `url(${paper})`,
};
