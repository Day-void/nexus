import { pgTable, index, text, timestamp, unique, boolean, foreignKey, integer, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const projectRole = pgEnum("project_role", ['owner', 'editor', 'viewer'])
export const projectStatus = pgEnum("project_status", ['active', 'archived'])
export const workspaceMemberStatus = pgEnum("workspace_member_status", ['active', 'invited', 'suspended'])
export const workspaceRole = pgEnum("workspace_role", ['owner', 'admin', 'member', 'viewer'])


export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	twoFactorEnabled: boolean("two_factor_enabled").default(false),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const passkey = pgTable("passkey", {
	id: text().primaryKey().notNull(),
	name: text(),
	publicKey: text("public_key").notNull(),
	userId: text("user_id").notNull(),
	credentialId: text("credential_id").notNull(),
	counter: integer().notNull(),
	deviceType: text("device_type").notNull(),
	backedUp: boolean("backed_up").notNull(),
	transports: text(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	aaguid: text(),
}, (table) => [
	index("passkey_credentialID_idx").using("btree", table.credentialId.asc().nullsLast().op("text_ops")),
	index("passkey_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "passkey_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const twoFactor = pgTable("two_factor", {
	id: text().primaryKey().notNull(),
	secret: text().notNull(),
	backupCodes: text("backup_codes").notNull(),
	userId: text("user_id").notNull(),
	verified: boolean().default(true),
	failedVerificationCount: integer("failed_verification_count").default(0),
	lockedUntil: timestamp("locked_until", { mode: 'string' }),
}, (table) => [
	index("twoFactor_secret_idx").using("btree", table.secret.asc().nullsLast().op("text_ops")),
	index("twoFactor_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "two_factor_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const workspace = pgTable("workspace", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	ownerId: text("owner_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	index("workspace_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "workspace_owner_id_user_id_fk"
		}).onDelete("restrict"),
	unique("workspace_slug_unique").on(table.slug),
]);

export const workspaceMember = pgTable("workspace_member", {
	id: text().primaryKey().notNull(),
	workspaceId: text("workspace_id").notNull(),
	userId: text("user_id").notNull(),
	role: workspaceRole().default('member').notNull(),
	status: workspaceMemberStatus().default('active').notNull(),
	joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("workspaceMember_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("workspaceMember_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "workspace_member_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "workspace_member_workspace_id_workspace_id_fk"
		}).onDelete("cascade"),
	unique("workspace_member_unique").on(table.workspaceId, table.userId),
]);

export const project = pgTable("project", {
	id: text().primaryKey().notNull(),
	workspaceId: text("workspace_id").notNull(),
	ownerId: text("owner_id").notNull(),
	name: text().notNull(),
	description: text(),
	status: projectStatus().default('active').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	index("project_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("text_ops")),
	index("project_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "project_owner_id_user_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "project_workspace_id_workspace_id_fk"
		}).onDelete("cascade"),
]);

export const projectMember = pgTable("project_member", {
	id: text().primaryKey().notNull(),
	projectId: text("project_id").notNull(),
	userId: text("user_id").notNull(),
	role: projectRole().default('viewer').notNull(),
	joinedAt: timestamp("joined_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("projectMember_projectId_idx").using("btree", table.projectId.asc().nullsLast().op("text_ops")),
	index("projectMember_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "project_member_project_id_project_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "project_member_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("project_member_unique").on(table.projectId, table.userId),
]);

export const activity = pgTable("activity", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	workspaceId: text("workspace_id"),
	projectId: text("project_id"),
	action: text().notNull(),
	targetType: text("target_type").notNull(),
	targetId: text("target_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("activity_createdAt_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("activity_projectId_idx").using("btree", table.projectId.asc().nullsLast().op("text_ops")),
	index("activity_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("activity_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "activity_project_id_project_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "activity_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "activity_workspace_id_workspace_id_fk"
		}).onDelete("cascade"),
]);

export const notification = pgTable("notification", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	type: text().notNull(),
	title: text().notNull(),
	message: text().notNull(),
	read: boolean().default(false).notNull(),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("notification_createdAt_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("notification_read_idx").using("btree", table.read.asc().nullsLast().op("bool_ops")),
	index("notification_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "notification_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const auditLog = pgTable("audit_log", {
	id: text().primaryKey().notNull(),
	actorId: text("actor_id"),
	action: text().notNull(),
	targetType: text("target_type").notNull(),
	targetId: text("target_id"),
	metadata: jsonb(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("auditLog_actorId_idx").using("btree", table.actorId.asc().nullsLast().op("text_ops")),
	index("auditLog_createdAt_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("auditLog_target_idx").using("btree", table.targetType.asc().nullsLast().op("text_ops"), table.targetId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.actorId],
			foreignColumns: [user.id],
			name: "audit_log_actor_id_user_id_fk"
		}).onDelete("set null"),
]);
