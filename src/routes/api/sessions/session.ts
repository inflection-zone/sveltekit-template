export interface Session {
	sessionId?: string;
	tenantId?: string;
	tenantCode?: string;
	tenantName?: string;
	roleId?: string;
	roleName?: string;
	accessToken?: string;
	refreshToken?: string;
	userId?: string;
	email?: string;
	username?: string;
	profileImageUrl?: string;
	fullName?: string;
	firstName?: string;
	expiryDate?: Date;
}
