export type PermissionsType = "purchase" | "manage_users";

export interface IPermissionConfig {
	active: boolean /**When active the permission handler will check for permissions */;
	actions: IPermissionActionsConfig /**When an action is set to true, it will check if the user has permissions for this action's name.*/;
	custom: boolean;
}

export interface IPermissionActionsConfig {
	all: boolean /**When all is set to true, the permission handler will check permissions for all defined actions */;
	purchase: boolean;
	manage_users: boolean;
}

export const permissionConfig: IPermissionConfig = {
	active: false,
	custom: true,
	actions: {
		all: false,
		purchase: true,
		manage_users: false,
	},
};

/**
 * These routes are private and require authentication
 * @type {string[]}
 */
export const protectedRoutesConfig = ["/account"];
