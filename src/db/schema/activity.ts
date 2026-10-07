import {
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { workspace } from "./workspace";
import { project } from "./project";

export const activity = pgTable(
  "activity",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id").references(() => workspace.id, {
      onDelete: "cascade",
    }),
    projectId: text("project_id").references(() => project.id, {
      onDelete: "cascade",
    }),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("activity_userId_idx").on(table.userId),
    index("activity_workspaceId_idx").on(table.workspaceId),
    index("activity_projectId_idx").on(table.projectId),
    index("activity_createdAt_idx").on(table.createdAt),
  ],
);