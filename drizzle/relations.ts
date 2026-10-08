import { relations } from "drizzle-orm/relations";
import { user, account, passkey, session, twoFactor, workspace, workspaceMember, project, projectMember, activity, notification, auditLog } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	passkeys: many(passkey),
	sessions: many(session),
	twoFactors: many(twoFactor),
	workspaces: many(workspace),
	workspaceMembers: many(workspaceMember),
	projects: many(project),
	projectMembers: many(projectMember),
	activities: many(activity),
	notifications: many(notification),
	auditLogs: many(auditLog),
}));

export const passkeyRelations = relations(passkey, ({one}) => ({
	user: one(user, {
		fields: [passkey.userId],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const twoFactorRelations = relations(twoFactor, ({one}) => ({
	user: one(user, {
		fields: [twoFactor.userId],
		references: [user.id]
	}),
}));

export const workspaceRelations = relations(workspace, ({one, many}) => ({
	user: one(user, {
		fields: [workspace.ownerId],
		references: [user.id]
	}),
	workspaceMembers: many(workspaceMember),
	projects: many(project),
	activities: many(activity),
}));

export const workspaceMemberRelations = relations(workspaceMember, ({one}) => ({
	user: one(user, {
		fields: [workspaceMember.userId],
		references: [user.id]
	}),
	workspace: one(workspace, {
		fields: [workspaceMember.workspaceId],
		references: [workspace.id]
	}),
}));

export const projectRelations = relations(project, ({one, many}) => ({
	user: one(user, {
		fields: [project.ownerId],
		references: [user.id]
	}),
	workspace: one(workspace, {
		fields: [project.workspaceId],
		references: [workspace.id]
	}),
	projectMembers: many(projectMember),
	activities: many(activity),
}));

export const projectMemberRelations = relations(projectMember, ({one}) => ({
	project: one(project, {
		fields: [projectMember.projectId],
		references: [project.id]
	}),
	user: one(user, {
		fields: [projectMember.userId],
		references: [user.id]
	}),
}));

export const activityRelations = relations(activity, ({one}) => ({
	project: one(project, {
		fields: [activity.projectId],
		references: [project.id]
	}),
	user: one(user, {
		fields: [activity.userId],
		references: [user.id]
	}),
	workspace: one(workspace, {
		fields: [activity.workspaceId],
		references: [workspace.id]
	}),
}));

export const notificationRelations = relations(notification, ({one}) => ({
	user: one(user, {
		fields: [notification.userId],
		references: [user.id]
	}),
}));

export const auditLogRelations = relations(auditLog, ({one}) => ({
	user: one(user, {
		fields: [auditLog.actorId],
		references: [user.id]
	}),
}));