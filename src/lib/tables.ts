import "server-only";
import { schema } from "./db";
import type { ResourceKey } from "./resources";

export const tables = {
  experience: schema.experience,
  project: schema.project,
  award: schema.award,
  skillGroup: schema.skillGroup,
} as const satisfies Record<ResourceKey, unknown>;
