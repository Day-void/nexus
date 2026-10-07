import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { workspace } from "./workspace";

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "archived",
]);

export const projectRoleEnum = pgEnum("project_role", [
  "owner",
  "editor",
  "viewer",
]);

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    description: text("description"),
    status: projectStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("project_workspaceId_idx").on(table.workspaceId),
    index("project_ownerId_idx").on(table.ownerId),
  ],
);

export const projectMember = pgTable(
  "project_member",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: projectRoleEnum("role").notNull().default("viewer"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    unique("project_member_unique").on(table.projectId, table.userId),
    index("projectMember_projectId_idx").on(table.projectId),
    index("projectMember_userId_idx").on(table.userId),
  ],
);